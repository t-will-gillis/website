// Import modules
const fs = require('fs');
const checkTeamMembership = require('../utils/check-team-membership');

// Global variables
var girhub
var context

async function main({ g, c }) {
  github = g;
  context = c;

  // Check if PR author is on the 'website-write' team
  const prAuthor = context.payload.pull_request.head.repo.owner.login;
  const prAuthor2 = context.payload.sender.login;
  const prNumber = context.payload.number;

  console.log(`PR Author: ${prAuthor}`);
  console.log(`PR Author2: ${prAuthor2}`);
  console.log(`PR Number: ${prNumber}`);
}


module.exports = main;
