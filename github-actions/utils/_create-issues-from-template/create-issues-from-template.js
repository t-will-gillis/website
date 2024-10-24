// Import modules
const fs = require('fs');
const readline = require('readline');
const issueTemplateParser = require('../issue-template-parser');

// Global variables
var github;
var context;

// Filepaths to source data and to issue template
var sourceFilepath = 'github-actions/utils/_create-issues-from-template/HfLA-Website_ spelling audit - Results copy.csv';
var templateFilepath = 'github-actions/utils/_create-issues-from-template/issue-maker-template.md';



async function main({ g, c }) {
  github = g;
  context = c;


  const input = fs.createReadStream(sourceFilepath);
  const rl = readline.createInterface({input});

  // Flag which lines in .csv file to process 
  const regex = /words|ignoreWords/;

  // Track which words are added
  const addedText = [];

  // Read .csv file line by line, then extract variables if line condition met
  rl.on('line', (row) => {
    row = row.split(',');
    if (regex.test(row[3])) {
      let textToInsert = row[1].split(':')[0].replaceAll('"','');
      // Create new issue only if text is not already added
      if (!addedText.includes(textToInsert)) {
        addedText.push(textToInsert);
        let listToAppend = row[3];
        let fileName = row[0];
        createIssue(github, context, {textToInsert, listToAppend, fileName});
      }
    }
  });
  rl.on('close', () => {
      console.log('File reading completed.');
  });
  console.log('\nWords added: ' + addedText);
  
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
