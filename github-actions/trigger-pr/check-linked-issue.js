// Import modules
const fs = require('fs');
const postIssueComment = require('../utils/post-issue-comment');

// Global variables
var github;
var context;

async function main({ g, c }) {
  github = g;
  context = c;

  // Retrieve body of context.payload and search for GitHub keywords
  const prBody = context.payload.pull_request.body;
  const prNumber = context.payload.pull_request.number;
  const prOwner = context.payload.pull_request.user.login;
  const regex = /(?!<!--)(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s*#(\d+)(?![^<]*-->)/gi;
  const match = prBody.match(regex);
  
  let prComment;
  // lllll
  if (!match) {
    console.log('PR does not have a properly linked issue. Posting comment...');
    prComment = `@${prOwner}, this Pull Request is not linked to a valid issue. Please provide a valid linked issue above in the format of 'Fixes #' + issue number, for example 'Fixes #9876'`;
  }
  
  else {
    console.log(match);
    let [ , keyword, linkNumber ] = match;
    console.log('Found a keyword: \'' + keyword + '\'. Checking for legitimate linked issue...');

    // Check if the linked issue exists in repo
    try {
      const response = await github.rest.issues.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: linkNumber,
      });
      console.log('Found an issue: \'#' + linkNumber + '\' in repo. Reference is a legitimate linked issue.');
    }
    catch (error) {
      console.log('Couldn\'t find issue #' + linkNumber + ' in repo. Posting comment...');
    prComment = `@${prOwner}, the issue number referenced above as "**${keyword}  #${linkNumber}**" is not found. Please replace with a valid issue number.`;
    }
  }

  // If the prComment was given text, then post the comment to the PR
  if (prComment) {
    postIssueComment(prNumber, prComment, github, context);
  }
}

module.exports = main;
