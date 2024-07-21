// Import modules
const fs = require("fs");
const postComment = require('../../utils/post-issue-comment');
const formatComment = require('../../utils/format-comment');
const getTimeline = require('../../utils/get-timeline');
const getTeamMembers = require('../../utils/get-team-members');
const queryIssueInfo = require('../../utils/query-issue-info');
const mutateIssueStatus = require('../../utils/mutate-issue-status');

// Global variables
var github;
var context;
let assignee;
var issueNum;

// The project id and field containing all statuses 
// const PROJECT_ID = "PVT_kwDOALGKNs4Ajuck";
// const STATUS_FIELD_ID = "PVTSSF_lADOALGKNs4AjuckzgcCutQ";
const PROJECT_ID = "PVT_kwHOAm6MB84Aiu3X";                        // for TWG
const STATUS_FIELD_ID = "PVTSSF_lAHOAm6MB84Aiu3XzgbNC9E";

const Emergent_Requests = "Emergent Requests";
const New_Issue_Approval = "New Issue Approval";
const Prioritized_Backlog = "Prioritized backlog";
const In_Progress = "In progress (actively working)";

// const statusValues = new Map([
//   [Emergent_Requests, "d468e876"],
//   [New_Issue_Approval, "83187325"],
//   [Prioritized_Backlog, "434304a8"],
//   [In_Progress, "9a878e9c"],
// ]);
const statusValues = new Map([
  [Emergent_Requests, "8749a929"],    // for TWG
  [New_Issue_Approval, "31082c42"],
  [Prioritized_Backlog, "3d615590"],
  [In_Progress, "4be08c01"],
]);
const READY_FOR_DEV_LABEL = "ready for dev lead";

/**
 * @description This function is the entry point into the JavaScript file. It formats the
 * markdown file based on the result of the previous step, checks if the developer is allowed
 * to be assigned to this issue, and performs the following actions:
 * - If the developer is not allowed, posts an "unassigned" comment, unassigns the developer,
 *   and updates the item status.
 * - Posts the formatted markdown to the issue.
 * @param {Object} g - GitHub object
 * @param {Object} c - Context object
 * @param {Boolean} shouldPost - The previous GitHub action's result
 * @param {Number} issueNum - The number of the issue where the post will be made
 */
async function main({ g, c }, { shouldPost, issueNum }) {
  try {
    // If the previous action returns false, stop here
    if(shouldPost === false) {
      console.log("Issue creator not a team member, no need to post comment.");
      return;
    }

    github = g;
    context = c;
    issueNum = issueNum;
    
    // Get the latest developer in case there are multiple assignees
    assignee = await getLatestAssignee();

    // Check if developer is allowed to work on this issue
    const isAdminOrMerge = await memberOfAdminOrMergeTeam();
    const isAssignedToAnotherIssue = await assignedToAnotherIssue();

    // If developer is not in Admin or Merge Teams, and is assigned to another issue/s, do the following:
    if(!isAdminOrMerge && isAssignedToAnotherIssue) {
      console.log(`Developer ${assignee} is assigned to multiple issues but isn't on Admin or Merge team. Going to...`);
      const comment = await createComment("multiple-issue-reminder.md");
      await postComment(issueNum, comment, github, context);
      console.log(' - add `multiple-issue-reminder.md` comment to issue');
      
      await unAssignDev(); // Unassign the developer
      console.log(' - remove the developer from the issue assignment');
      
      await addLabel(READY_FOR_DEV_LABEL); // Add 'ready for dev lead' label
      console.log(' - add `ready for dev lead` label to issue');

      // Update item's status to "New Issue Approval"
      console.log('last before change status');
      const itemInfo = await queryIssueInfo(github, context, issueNum);
      await mutateIssueStatus(github, context, itemInfo.id, statusValues.get(New_Issue_Approval));
      console.log(' - change issue status to "New Issue Approval"');
    } else {
      // Otherwise, proceed with checks 
      const comment = await createComment("preliminary-update.md");
      await postComment(issueNum, comment, github, context);
    }
  } catch(error) {
    throw new Error(error);
  }
}

/**
 * @description - This function Check if developer is in the Admin or Merge Team
 * @returns {Boolean} - return true if developer is member of Admin/Merge team, false otherwise
 */
async function memberOfAdminOrMergeTeam() {
  try {
    // Get all members in Admin Team
    const websiteAdminsMembers = await getTeamMembers(github, context, "website-admins");
  
    // Get all members in Merge Team
    const websiteMergeMembers = await getTeamMembers(github, context, "website-merge");
  
    // Return true if developer is a member of the Admin or Merge Teams
    return(assignee in websiteAdminsMembers || assignee in websiteMergeMembers);
  } catch(error) {
    throw new Error("Error getting membership status: " + error);
  }
}

/**
 * @description - Check whether developer is assigned to another issue
 * @returns {Boolean} - return true if developer is assigned to another issue/s
 */
async function assignedToAnotherIssue() {
  try {
    const issues = (await github.rest.issues.listForRepo({
      owner: context.repo.owner,
      repo: context.repo.repo,
      assignee: assignee,
    })).data;

    const otherIssues = [];
    let issueNum = context.payload.issue.number;
    for(const issue of issues) {
      // Check if assignee's other issue is an "Agenda" issue
      const isAgendaIssue = issue.labels.some(label => label.name === "feature: agenda");

      // ...or a "Prework" issue
      const isPreWork = issue.labels.some(label => label.name === "Complexity: Prework");

      // ...or has "Emergent Request" Status
      console.log('checking ER');
      const inEmergentRequestStatus = (await queryIssueInfo(github, context, issueNum)).statusName === Emergent_Requests;
    
      // ...or has "New Issue Approval" Status
      console.log('checking NIA');
      const inNewIssueApprovalStatus = (await queryIssueInfo(github, context, issueNum)).statusName === New_Issue_Approval;
    
      // Include the assignee's other issue only if none of the conditions are met
      if(!(isAgendaIssue || isPreWork || inEmergentRequestStatus || inNewIssueApprovalStatus))
        otherIssues.push(issue);
    }
  
    // If developer is assigned to another issue/s, return true 
    return otherIssues.length > 1;
  } catch(error) {
    throw new Error("Error getting other issues: " + error);
  }
}

/**
 * @description - Unassign developer from the issue
 */
async function unAssignDev() {
  try {
    await github.rest.issues.removeAssignees({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.issue.number,
      assignees: [assignee],
    });
  } catch(error) {
    throw new Error("Error unassigning developer: " + error);
  }
}

/**
 * @description - Create a comment using the template 
 * of the filenName in "add-preliminary-comment" directory
 * @param {String} fileName - the file name of the used template
 * @returns {String} - return formatted comment
 */
async function createComment(fileName) {
  try {
    console.log('before commenting');
    const { statusName } = await queryIssueInfo(github, context, issueNum);

    const isPrework = context.payload.issue.labels.some((label) => label.name === 'Complexity: Prework');
    const isDraft = context.payload.issue.labels.some((label) => label.name === 'Draft');

    if(statusName === New_Issue_Approval && !isDraft && !isPrework) {
      if(context.payload.issue.user.login === assignee) {
        fileName = 'draft-label-reminder.md';
      } else {
        fileName = 'unassign-from-NIA.md';
        await unAssignDev();
      }
    }

    const filePath = './github-actions/trigger-issue/add-preliminary-comment/' + fileName;
    const commentObject = {
      replacementString: assignee,
      placeholderString: '${issueAssignee}',
      filePathToFormat: filePath,
      textToFormat: null
    };

    // Return the formatted comment
    const formattedComment = formatComment(commentObject, fs);
    return formattedComment;
  } catch(error) {
    throw new Error("Error creating comment: " + error);
  }
}

/**
 * @description - Add 'ready for dev lead' label to the issue
 * @param {String} labelName - Name of the label to add
 */
async function addLabel(labelName) {
  try {
    await github.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.issue.number,
      labels: [labelName],
    });
  } catch(error) {
    throw new Error("Error Adding label: " + error);
  }
}

/**
 * @description - Get latest assignee, in case there are multiple assignees to the issue
 * @returns {String} - return the username of the latest assignee
 */
async function getLatestAssignee() {
  try {
    let issueAssignee = context.payload.issue.assignee.login;
    const eventdescriptions = await getTimeline(context.payload.issue.number, github, context);
    
    // Find out the latest developer assigned to the issue
    for(let i = eventdescriptions.length - 1; i >= 0; i -= 1) {
      if(eventdescriptions[i].event == 'assigned') {
        issueAssignee = eventdescriptions[i].assignee.login;
        break;
      }
    }
    return issueAssignee;
  } catch(error) {
    throw new Error("Error getting last assignee: " + error);
  }
}

module.exports = main;
