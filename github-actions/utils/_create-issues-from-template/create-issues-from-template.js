// Import modules
const fs = require('fs');
const readline = require('readline');
const issueTemplateParser = require('../issue-template-parser');

// Global variables
var github;
var context;

// Filepaths to source data and to issue template
var sourceFilepath = './HfLA-Website_ spelling audit - Results copy.csv';
var templateFilepath = './issue-maker-template.md';



async function main({ g, c }) {
  github = g;
  context = c;

  // Read .csv file line by line
  const input = fs.createReadStream(sourceFilepath);
  const rl = readline.createInterface({input});

  rl.on('line', (row) => {
    // Process each line to extract variables
    row = row.split(',');

    // The following are the variables to be extracted from the file
    // once it has been read- this will vary with each condition
    // Flag which lines in .csv file to process 
    const regex = /words|ignoreWords/;
    if (regex.test(row[3])) {
      let textToInsert = row[1].split(':')[0].replaceAll('"','');
      let listToAppend = row[4];
      let fileName = row[0];
      createIssue(github, context, {textToInsert, listToAppend, fileName})
    }
  });
}

const createIssue = async (github, context, {textToInsert, listToAppend, fileName}) => {

  const owner = context.repo.owner;
  const repo = context.repo.repo;

  // Uses issueTemplateParser to pull the relevant data from the issue template
  const issueObject = issueTemplateParser(templateFilepath);

  let title = issueObject['title'];
  let labels = issueObject['labels'];
  let milestone = parseInt(issueObject['milestone']);
  let body = issueObject['body'];

  // Replace variables in issue template body
  title = title.replace('${textToInsert}', textToInsert);
  body = body.replaceAll('${textToInsert}', textToInsert);
  body = body.replaceAll('${listToAppend}', listToAppend);
  body = body.replaceAll('${fileName}', fileName);

  // Create issue
  const issue = await github.rest.issues.create({
    owner,
    repo,
    title,
    body,
    labels,
    milestone,
  });
  console.log(`Created issue "${title}"`);
};

module.exports = main;
