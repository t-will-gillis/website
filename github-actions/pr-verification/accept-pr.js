// Import modules
// const fs = require('fs');
const checkTeamMembership = require('../utils/check-team-membership');
const postIssueComment = require('../utils/post-issue-comment');

// Global variables
var github;
var context;

async function main({ g, c }) {
  github = g;
  context = c;

  // Check if PR author is on the 'website-write' team
  const prAuthor = context.payload.sender.login;
  const prNumber = context.payload.number;
  const team = 'website-write';
  const team_check = await checkTeamMembership(github, prAuthor, team);
  console.log(`just checked team status: ${team_check}`);
  if (!team_check) {
    console.log(`${prAuthor} is not a member of ${team}- closing PR with comment`);
    await github.rest.pulls.update({
        owner : 't-will-gillis',
        // owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: prNumber,
        state : 'closed'
      });
    let comment = 'You must be a member of the HFLA website team in order to create pull requests. Please see our page on how to join us as a member at HFLA: https://www.hackforla.org/getting-started. If you have been though onboarding, and feel you have received this message in error, please message us in the #hfla-site team Slack channel with the link to this PR.';
    postIssueComment(prNumber, comment, github, context);
  } else {
    console.log(`${prAuthor} is a member of ${team}- proceeding with PR`);
  }
}


module.exports = main;
