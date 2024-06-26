// Import modules
const fs = require('fs');
const checkTeamMembership = require('../utils/check-team-membership');
const postIssueComment = require('../utils/post-issue-comment');

// Global variables
var github
var context

async function main({ g, c }) {
  github = g;
  context = c;

  // Check if PR author is on the 'website-write' team
  const prAuthor = context.payload.sender.login;
  const prNumber = context.payload.number;
  const team = 'website-write';

  console.log(`Owner: ${context.repo.owner}`);
  console.log(`Repo: ${context.repo.repo}`);
  console.log(`PR Author: ${prAuthor}`);
  console.log(`PR Number: ${prNumber}`);

  if (!checkTeamMembership(github, prAuthor, team) {
    await github.rest.issues.update({
        owner : 't-will-gillis',
        // owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        state : 'closed'
      });
    let comment = 'You must be a member of the HFLA website team in order to create pull requests. Please see our page on how to join us as a member at HFLA: https://www.hackforla.org/getting-started. If you have been though onboarding, and feel you have received this message in error, please message us in the #hfla-site team Slack channel with the link to this PR.'
    postIssueComment(prNumber, comment, github, context);
  }
}


module.exports = main;
