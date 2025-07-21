const retrieveSkillsIssue = require('../utils/retrieve-skills-issue');
const postComment = require('../utils/post-issue-comment');

async function postToSkillsIssue({g, c}, activity) {

    github = g;
    context = c;

    const owner = context.repo.owner;
    const repo = context.repo.repo;

    const username = activity[0];
    const message = activity[1];
    const MARKER = '<!-- Skills Issue Activity Record -->';

    // DONE: if `username` == bot account (yes) or nonwebsite (maybe) END workflow
    // DONE: function to find Skills Issue
    // DONE: then add message to Skills Issue
    // DONE: check whether bot can edit an existing message... 

    // to d0: If active member, open Skills- move to 'In progress'. else close Skills 


    // Retrieve user's Skills Issue
    // const skillsIssueNum = await retrieveSkillsIssue(username);
    const skillsIssueNum = 1191;
    
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

    // if (!skillsPostComments.ok) {
    //     throw new Error(`Failed to fetch comments: ${skillsPostComments.statusText}`);
    // }
    
    // Find the comment that included the MARKER text and append
    const commentFound = commentData.data.find(comment => comment.body.includes(MARKER))
    const commentFoundId = commentFound ? commentFound.id : null;
    console.log(commentFound.id);
    console.log(commentFound.body);
    if (commentFound) {
        const commentId = commentFoundId;
        const originalBody = commentFound.body;
        const updatedBody = `${originalBody}\n${message}`;
        // const body= JSON.stringify({ body: updatedBody })
        // https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#update-an-issue-comment
        const patchSkillsIssue = await github.request('PATCH /repos/{owner}/{repo}/issues/comments/{commentId}', {
            owner,
            repo,
            commentId,
            body: updatedBody
        });
    } else {
        const body = `${MARKER}\n## ${username} Activity Log\n${message}`;
        await postComment(github, context, skillsIssueNum, body);
    }


}

module.exports = postToSkillsIssue;