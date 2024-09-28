const issueTemplateParser = require('../../utils/issue-template-parser');

// Global variables
var github;
var context;

async function main({ g, c }) {
  github = g;
  context = c;

  // (removal) Retrieve lists data from json file written in previous step

  const owner = context.repo.owner;
  const repo = context.repo.repo;


  
  // Create a new issue in repo, return the issue id for later: creating the project card linked to this issue
  // const issue = await createIssue(owner, repo, filepath, workflow_file, label_list);


  // (removal) Add issue number used to reference the issue and comment on the `Dev/PM Agenda and Notes`


  const createIssue = async (owner, repo, filepath, workflow_file, label_list) => {

    // Uses issueTemplateParser to pull the relevant data from the issue template
    const pathway = 'github-actions/trigger-schedule/list-inactive-members/for-6454.md';
    const issueObject = issueTemplateParser(pathway);

    let title = issueObject['title'];
    let labels = issueObject['labels'];
    let milestone = parseInt(issueObject['milestone']);
    let body = issueObject['body'];

    // Replace variables in issue template body
    title = title.replace('${workflow_file}', workflow_file);
    body = body.replaceAll('${workflow_file}', workflow_file);
    body = body.replaceAll('${filepath}', filepath);
    body = body.replaceAll('${label_list}', label_list);

    // Create issue
    const issue = await github.rest.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
      milestone,
    });
    console.log('Created issue ');
    return issue.data;
  };


  let filepaths = ["/move-closed-issues/","/trigger-issue/add-missing-labels/","/trigger-issue/add-missing-labels/","/trigger-issue/add-preliminary-comment/","/trigger-issue/add-preliminary-comment/","/trigger-issue/add-preliminary-comment/","/trigger-issue/create-codeql-issues/","/trigger-schedule/add-update-label-weekly/"];
  let workflow_files = ["sort-closed-issues.js","check-labels.js","post-labels-comments.js","check-label-preliminary-update","preliminary-update-comment.js","check-complexity-eligibility.js","create-new-issues.js","add-label.js"];
  let label_lists = [['Feature: Refactor CSS', 'Feature: Refactor HTML', 'Feature: Refactor JS / Liquid', 'Feature: Refactor GHA', 'role: back end/devOps', 'Feature: Analytics', 'role: front end'],['Complexity: Missing', 'role missing', 'Feature Missing', 'size: missing', 'good first issue', 'ready for dev lead', 'Feature: Administrative', 'size: 0.25pt', 'Complexity: Small', 'role: dev leads'],['Complexity: Missing', 'role missing', 'Feature Missing', 'size: missing'],['role: front end', 'role: back end/devOps', 'role: design', 'role: user research'],['Ready for Prioritization', 'feature: agenda', 'Complexity: Prework', 'Draft'],['ER', 'epic', 'role: front end', 'role: back end/devOps', 'good first issue', 'Complexity: Small', 'Complexity: Medium'],['ready for dev lead'],['Status: Updated', 'To Update !', '2 weeks inactive']];

  for (let i = 0; i < filepaths.length; i++) {
    let filepath = "https://github.com/hackforla/website/tree/gh-pages/github-actions"+filepaths[i]+workflow_files[i];
    let workflow_file = workflow_files[i];
    let label_list = "";
    for (let item of label_lists[0]) {
      label_list += "`"+item+"`, "
    }
    await createIssue('hackforla', 'website', filepath, workflow_file, label_list);
  }

};


module.exports = main;
