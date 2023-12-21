// Import modules

// Global variables
var github;
var context;

async function main({ g, c }, newIssueNumber) {
  github = g;
  context = c;

  // Issue #2607 is the `Dev/PM Agenda and Notes` 
  let agendaAndNotesIssueNumber = 409;
  await commentOnIssue(agendaAndNotesIssueNumber, newIssueNumber);
}

// Add a link to the `Review Inactive Team Members` issue
const commentOnIssue = async (agendaAndNotesIssueNumber, newIssueNumber) => {
  const owner = "t-will-gillis";
  const repo = "website";
  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: agendaAndNotesIssueNumber,
    body: `**Review Inactive Team Members:** #${newIssueNumber}`,
  });
};

module.exports = main;
