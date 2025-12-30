// Import modules
const retrieveLabelDirectory = require('../utils/retrieve-label-directory');
const querySkillsIssue = require('../utils/query-skills-issue');
const postComment = require('../utils/post-issue-comment');
const checkTeamMembership = require('../utils/check-team-membership');
const statusFieldIds = require('../utils/_data/status-field-ids');
const mutateIssueStatus = require('../utils/mutate-issue-status');
const { lookupSkillsDirectory, updateSkillsDirectory } = require('../utils/skills-directory'); 

// `complexity0` refers `Complexity: Prework` label
const SKILLS_LABEL = retrieveLabelDirectory("complexity0");



/**
 * Function to get eventActor's Skills Issue and post message
 * @param {Object} github    - GitHub object 
 * @param {Object} context   - Context object
 * @param {Object} activity  - eventActor and message 
 * 
 */
async function postToSkillsIssue({github, context}, activity) {

    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const TEAM = 'website-write';
  
    const [eventActor, message] = activity;
    const MARKER = '<!-- Skills Issue Activity Record -->';
    const COMMENT_BODY_HEADER =
        `${MARKER}\n` +
        `## Activity Log: ${eventActor}\n` +
        `### Repo: https://github.com/hackforla/website\n\n` +
        `##### ⚠ Important note: The bot updates this comment automatically - do not edit\n\n` +
        `${message}`;
    const IN_PROGRESS_ID = statusFieldIds('In_Progress');
  
    // If eventActor undefined, exit
    if (!eventActor) {
        console.log(`eventActor is undefined (likely a bot). Cannot post message...`);
        return;
    }
  
    // Step 1: Check for eventActor's Skills Issue
    let needsUpdate = false;
    let skillsInfo = lookupSkillsDirectory(eventActor);
  
    if (!skillsInfo) {
        console.log(`No cached Skills Issue found for ${eventActor}, querying GitHub...`);
        skillsInfo = await querySkillsIssue(github, context, eventActor, SKILLS_LABEL, MARKER);
        if (skillsInfo && skillsInfo.issueNum) {
            needsUpdate = true;
        } else {
            console.log(` ⮡  No Skills Issue found for ${eventActor}. Cannot post message.`);
            return;
        }
    }
  
    // Step 2: Get eventActor's Skills Issue number, nodeId, current statusId, isArchived, and cached commentId
    const skillsIssueNum = skillsInfo.issueNum;
    const skillsIssueNodeId = skillsInfo.issueId;
    const skillsStatusId = skillsInfo?.statusId || 'unknown';
    const isArchived = skillsInfo?.isArchived || false;
    let commentIdFound = skillsInfo?.commentId || null;
    let commentBody = skillsInfo?.commentBody || null;
    let commentFound = null;
  
    // remove next section for final
    console.log(`skillsIssueNum: ${skillsIssueNum}`);  
    console.log(`skillsIssueNodeId: ${skillsIssueNodeId}`);
    console.log(`skillsStatusId: ${skillsStatusId}`);
    console.log(`isArchived: ${isArchived}`);
    console.log(`commentIdFound: ${commentIdFound}`);
  
    console.log(` ⮡  Found Skills Issue for ${eventActor}: #${skillsIssueNum}`);
  
    // If commentIdFound does not exist, retrieve from skills issue
    if (!commentIdFound) {
        console.log(` ⮡  No cached comment ID for ${eventActor}, will search #${skillsIssueNum} for MARKER...`);
        let commentData;
    
        try {
            commentData = await github.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
                owner,
                repo,
                per_page: 100,
                issue_number: skillsIssueNum
            });
            commentFound = commentData.data.find((comment) => comment.body.includes(MARKER));
            commentIdFound = commentFound ? commentFound.id : null;
        } catch (err) {
            console.error(` ⮡  GET comments failed for issue #${skillsIssueNum}:`, err);
            return;
        }
    }
  
    // If commentIdFound from either cached ID or search
    if (commentIdFound) {
        console.log(` ⮡  Found comment with MARKER...`);
        if (!commentBody) {
            try {
                const commentResponse = await github.request('GET /repos/{owner}/{repo}/issues/comments/{comment_id}', {
                    owner,
                    repo,
                    comment_id: commentIdFound
                });
                commentBody = commentResponse.data.body;
            } catch (err) {
                console.error(` ⮡  GET comment failed for comment ID ${commentIdFound}:`, err);
                return;
            }
        }
        const updatedBody = `${commentBody}\n${message}`;
        try {
            await github.request('PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}', {
                owner,
                repo,
                comment_id: commentIdFound,
                body: updatedBody,
            });
            console.log(` ⮡  Entry posted to Skills Issue #${skillsIssueNum}`);
        } catch (err) {
            console.error(` ⮡  Something went wrong posting entry to #${skillsIssueNum}:`, err);
        }
    } else {
        console.log(` ⮡  MARKER not found, creating new comment entry with MARKER...`);
        try {
            const response = await github.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
                owner,
                repo,
                issue_number: skillsIssueNum,
                body: COMMENT_BODY_HEADER,
            });
            console.log(` ⮡  Entry posted to Skills Issue #${skillsIssueNum}`);
            // Cache new comment ID
            commentIdFound = response.data.id;
        } catch (err) {
            console.error(` ⮡  Failed to create new comment for issue #${skillsIssueNum}:`, err);
        }
    }
  
    if (needsUpdate) {
        console.log(` ⮡  Updating Skills Directory for ${eventActor}...`);
        updateSkillsDirectory(eventActor, skillsIssueNum, skillsIssueNodeId, commentIdFound);
    };
    
    // Only proceed if Skills Issue message does not include: 'closed', 'assigned', or isArchived 
    if (!(message.includes('closed') || message.includes('assigned') || isArchived)) {
  
        // If eventActor is team member, open issue and move to "In progress"
        // const isActiveMember = await checkTeamMembership(github, context, eventActor, TEAM);
        const isActiveMember = true;                                                   // REMOVE THIS LINE AND UNCOMMENT ABOVE FOR FINAL
    
        if (isActiveMember) {
            try {
                await github.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
                    owner,
                    repo,
                    issue_number: skillsIssueNum,
                    state: "open",
                });
                console.log(` ⮡  Re-opened issue #${skillsIssueNum}`);
                // Update item's status to "In progress (actively working)" if not already
                if (skillsIssueNodeId && skillsStatusId !== IN_PROGRESS_ID) {
                    const statusMutated = await mutateIssueStatus(github, context, skillsIssueNodeId, IN_PROGRESS_ID);
                    if (statusMutated) console.log(` ⮡  Changed issue #${skillsIssueNum} to "In progress"`);
                }
            } catch (err) {
                console.error(` ⮡  Failed to update issue #${skillsIssueNum} state:`, err);
            }
        }
    }
    // Return true if needsUpdate = true, else return false
    if (needsUpdate) {
        return true
    } else {
        return false
    }
}

module.exports = postToSkillsIssue;
