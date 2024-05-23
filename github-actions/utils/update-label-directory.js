const fs = require('fs');

// Global variables
var github;
var context;

/*
 * Function triggered by the `update-label-directory.yml`
 * @param {Object} g     - github object from actions/github-script
 * @param {Object} c     - context object from actions/github-script
 */
async function main({ g, c }) {
  
  github = g;
  context = c;

  const labelId = context.payload.label.id + '';
  const labelName = context.payload.label.name;

  console.log('-------------------------------------------------------');
  console.log('Label reference info:');
  console.log(context.payload.label);
  console.log('-------------------------------------------------------');
  if(context.payload.action === 'edited') {
    console.log('What was changed:');
    console.log(context.payload.changes);
    console.log('-------------------------------------------------------');
  }
  
  // If the action is 'edited' but does not entail name change, label directory is not affected.
  if (context.payload.action === 'edited' && !context.payload.changes.name) {
    console.log(`\nThe label edits do not affect \`label-directory.json\`; file was not updated!`);
    return;
  } 

  // Otherwise, retrieve label directory 
  const filepath = 'github-actions/utils/_data/label-directory.json';
  const rawData = fs.readFileSync(filepath, 'utf8');
  const data = JSON.parse(rawData);
  let keyName = '';

  // Check for 'labelId' in label directory and return 'keyName'
  if (context.payload.action === 'edited' || context.payload.action === 'deleted') {
    for (let [key, value] of Object.entries(data)) {
      if (value.includes(labelId)) {
        console.log(`${labelId} found; '${labelName}' will be ${context.payload.action}`);
        keyName = key;
        break;
      }
    }
    // If 'labelId' not found...
    if (!keyName) { 
      // ...but 'labelName' deleted from repo, won't affect `label-directory.json`
      if (context.payload.action === 'deleted') {
        console.log(`\nThe labelId: ${labelId} matching the labelName: '${labelName}' was not found in repo.`);
        console.log(`The label does not exist in \`label-directory.json\`; file was not updated!`);
        postWarning();
        return;
      } else {
        console.log(`The labelId: ${labelId} not found in repo! Creating new keyName and entry`);
        keyName = createKeyName(data, labelName);
      }
    }
  }

    
  // If 'labelId' does not exist, create new camelCased 'keyName' so label entry can be added to directory
  if (context.payload.action === 'created') {
    createKeyName(data, labelName);
  }

  // Update directory (delete, edit, or create) and log
  if(context.payload.action === 'deleted') {
    delete data[keyName];
    console.log(`\nDeleting label from directory:\n { "${keyName}": [ "${labelId}", "${labelName}" ] }\n`);
    postWarning();
  } else {
    data[keyName] = [labelId, labelName];
    console.log(`\nWriting label data to directory:\n { "${keyName}": [ "${labelId}", "${labelName}" ] }\n`);
  }

  // Write data file in prep for committing changes to label directory
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log(`-------------------------------------------------------`);
    console.log(`File \`label-directory.json\` has been staged. Next step will commit file.`);
  });
}



function createKeyName(data, labelName) {
  let keyName = '';
  const isAlphanumeric = str => /^[a-z0-9]+$/gi.test(str);
  let labelInterim = labelName.split(/[^a-zA-Z0-9]+/);
  for (let i = 0; i < labelInterim.length ; i++) {
      if (i === 0) {
          keyName += labelInterim[0].toLowerCase();
      } else if (isAlphanumeric(labelInterim[i])) {
          keyName += labelInterim[i].split(' ').map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      }
  }
  // If the 'keyName' already exists for some reason, add the word 'COPY' so it does not overwrite existing (and to flag it)
  if (data[keyName]) {
    keyName += 'COPY';
  }
  console.log(`A new keyName '${keyName}' has been created.`);
  return keyName;
}



function postWarning() {
  console.log('In postWarning()- Temp message!');
}


module.exports = main;
