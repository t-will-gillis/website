const retrieveSkillsIssue = require('../utils/retrieve-skills-issue');
const postComment = require('../utils/post-issue-comment');
const checkTeamMembership = require('../utils/check-team-membership');
const statusFieldIds = require('../../utils/_data/status-field-ids');
const mutateIssueStatus = require('../utils/mutate-issue-status');



async function postToSkillsIssue({g, c}, activity) {

    github = g;
    context = c;

    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const team = 'website-write';

    const username = activity[0];
    const message = activity[1];
    const MARKER = '<!-- Skills Issue Activity Record -->';

    // DONE: if `username` == bot account (yes) or nonwebsite (maybe) END workflow
    // DONE: function to find Skills Issue
    // DONE: then add message to Skills Issue
    // DONE: check whether bot can edit an existing message... 
    // DONE: If active member, open Skills- move to 'In progress'.

    // Retrieve user's Skills Issue
    // const { skillsIssueNum, skillsIssueNodeId } = await retrieveSkillsIssue(username);
    const skillsIssueNum  = 1191; 
    const skillsIssueNodeId = "I_kwDOIOiMwM68Q49F";

    if (skillsIssueNum) {
        console.log(`Found Skills Issue for ${username}: ${skillsIssueNum}`);
        // await postComment(skillsIssueNum, message, github, context);
    } else {
        console.log(`Did not find Skills Issue for ${username}. Cannot post message.`);
        return
    }

    // Retrieve all comments from the Skills Issue
    // https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#list-issue-comments
    const commentData = await github.request('GET /repos/{owner}/{repo}/issues/{issueNum}/comments', {
        owner,
        repo,
        issueNum: skillsIssueNum,
    });

    // Find the comment that included the MARKER text and append
    const commentFound = commentData.data.find(comment => comment.body.includes(MARKER))
    const commentFoundId = commentFound ? commentFound.id : null;
    console.log(commentFound.id);
    console.log(commentFound.body);
    if (commentFound) {
        const commentId = commentFoundId;
        const originalBody = commentFound.body;
        const updatedBody = `${originalBody}\n${message}`;
        // https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#update-an-issue-comment
        const patchSkillsIssue = await github.request('PATCH /repos/{owner}/{repo}/issues/comments/{commentId}', {
            owner,
            repo,
            commentId,
            body: updatedBody
        });
    } else {
        const body = `${MARKER}\n## Activity Log: ${username}\n${message}`;
        await postComment(github, context, skillsIssueNum, body);
    }

    // Check whether eventActor is team member; if so open issue and move to "In progress"
    const isActiveMember = await checkTeamMembership(github, username, team);

    if (isActiveMember) {
        await github.request('PATCH /repos/{owner}/{repo}/issues/{issueNum}', {
            owner,
            repo,
            issueNum: skillsIssueNum,
            state: "open",
        });
        // Update item's status to "New Issue Approval"
        let statusValue = statusFieldIds('New_Issue_Approval');
        await mutateIssueStatus(github, context, skillsIssueNodeId, statusValue);
    }
}

module.exports = postToSkillsIssue;