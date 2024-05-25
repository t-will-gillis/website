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
  let labelPacket = {};

  console.log(`-------------------------------------------------------`);
  console.log(`Label reference info:`);
  console.log(context.payload.label);
  console.log(`-------------------------------------------------------`);
  if(context.payload.action === 'edited') {
    console.log(`What was changed:`);
    console.log(context.payload.changes);
    console.log(`-------------------------------------------------------`);
  }
  
  // If action is 'edited' but doesn't entail name change, label directory is not affected- exit
  if (context.payload.action === 'edited' && !context.payload.changes.name) {
    console.log(`\nThe label edits do not affect \`label-directory.json\`; file was not updated!`);
    return labelPacket;
  } 

  // Otherwise, retrieve label directory 
  const filepath = 'github-actions/utils/_data/label-directory.json';
  const rawData = fs.readFileSync(filepath, 'utf8');
  const data = JSON.parse(rawData);
  let keyName = '';
  

  // Check for 'labelId' in label directory and return 'keyName'
  if (context.payload.action === 'edited' || context.payload.action === 'deleted') {
    keyName = cycleThroughDirectory(data, labelId);
    if (keyName) { 
      console.log(`The labelId: ${labelId} found; '${labelName}' will be ${context.payload.action}`);
    } else if (context.payload.action === 'deleted') {
      // If no keyName found, check that the labelName does not exist
      keyName = cycleThroughDirectory(data, labelName);
      if (keyName) {
        message = `\nThe labelId: '${labelId}' was not found, but the labelName: '${labelName}' was- this needs review!`;
      } else {
        message = `\nNeither the labelId: ${labelId} nor the labelName: '${labelName}' were found in repo.`;
      }
      console.log(`The label does not exist in \`label-directory.json\`; file was not updated!`);
      console.log(message);
      labelPacket = postWarning(labelId, labelName, message);
      return labelPacket;
    } else {
      // The last option is that the labelId doesn't exist because it is being added
      keyName = createKeyName(data, labelName);
      message = `The labelId: ${labelId} not found in repo! Created new keyName and adding to \`label-directory.json\``;
      console.log(message);
      labelPacket = postWarning(labelId, labelName, message);
      return labelPacket;
    }
  }
  
    
  // If 'labelId' does not exist, create new camelCased 'keyName' so label entry can be added to directory
  if (context.payload.action === 'created') {
    keyName = createKeyName(data, labelName);
  }

  // Update directory (delete, edit, or create) and log
  if(context.payload.action === 'deleted') {
    delete data[keyName];
    message = `\nDeleted label from directory:\n { "${keyName}": [ "${labelId}", "${labelName}" ] }\n`;
    console.log(message);
    labelPacket = postWarning(labelId, labelName, message);
    return labelPacket;
  } else {
    data[keyName] = [labelId, labelName];
    console.log(`\nWriting label data to directory:\n { "${keyName}": [ "${labelId}", "${labelName}" ] }\n`);
  }

  // Write data file in prep for committing changes to label directory
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log(`-------------------------------------------------------`);
    console.log(`Changes to \`label-directory.json\` have been staged. Next step will commit changes.`);
  });
}



function cycleThroughDirectory(data, searchValue) {
  for (let [key, value] of Object.entries(data)) {
    if (value.includes(searchValue)) {
      keyName = key;
      return keyName;
    } 
  }
  return undefined;
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



function postWarning(labelId, labelName, message) {
  console.log(`-------------------------------------------------------`);
  console.log(`\nCreating labelPacket to send to Google Apps Script file`);

  // Create label packet to send to Google Apps Script sheet
  let prePacket = { labelId, labelName, message };
  const packet = JSON.stringify( prePacket , null, 2 );
  return packet
}


// function writeData(removedContributors, notifiedContributors, cannotRemoveYet){
  
//   const filepath = 'github-actions/utils/_data/inactive-members.json';
//   const inactiveMemberLists = { removedContributors, notifiedContributors, cannotRemoveYet };

//   fs.writeFile(filepath, JSON.stringify(inactiveMemberLists, null, 2), (err) => {
//     if (err) throw err;
//     console.log('-------------------------------------------------------');
//     console.log("File 'inactive-members.json' saved successfully!");
//    });
// }



module.exports = main;
