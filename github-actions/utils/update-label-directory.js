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
  const labelAction = context.payload.action;

  console.log(`-------------------------------------------------------`);
  console.log(`Label reference info:`);
  console.log(context.payload.label);
  console.log(`-------------------------------------------------------`);
  if(context.payload.action === 'edited') {
    console.log(`What was changed:`);
    console.log(context.payload.changes);
    console.log(`-------------------------------------------------------`);
  }
  
  // If label 'edited' but changes do not include 'name', label directory is not updated and workflow exits
  if (context.payload.action === 'edited' && !context.payload.changes.name) {
    console.log(`\nThe label edits do not affect \`label-directory.json\`; file will not be updated!`);
    return {};
  } 

  // Otherwise, retrieve label directory 
  const filepath = 'github-actions/utils/_data/label-directory.json';
  const rawData = fs.readFileSync(filepath, 'utf8');
  const data = JSON.parse(rawData);
  let keyName = '';
  let actionAddOn = '';

  // If label 'deleted', check for 'labelId' in label directory and if found return 'keyName' 
  if (labelAction === 'deleted') {
    keyName = cycleThroughDirectory(data, labelId);
    if (keyName) {
      // If the 'keyName' is found with 'labelId', remove from JSON but flag for review
      message = `The keyName: '${keyName}' for labelId: '${labelId}' found, but Id no longer valid--> wiping in JSON. This needs review!`;
      labelId = 999999999;
      actionAddOn = ' / id found';
      writeToJsonFile(filepath, data, keyName, labelId, labelName);
    } else {
      // If the 'keyName' not found with 'labelId', rerun with 'labelName'
      keyName = cycleThroughDirectory(data, labelName);
      if (keyName) {
        message = `\nThe labelId: '${labelId}' not found, but labelName: '${labelName}' was- this needs review! No updates to JSON.`;
        actionAddOn = ' / check name';
      } else {
        message = `\nNeither labelId: ${labelId} nor labelName: '${labelName}' found- this needs review! No updates to JSON.`;
        actionAddOn = ' / not found';
      }
    }
  }
 
  // If 'edited' incl. 'name', check for 'labelId' in label directory and if found return 'keyName' 
  if (labelAction === 'edited' ) {
    keyName = cycleThroughDirectory(data, labelId);
    // If the 'keyName' is returned, it is assumed that the change is known. Label directory will be updated w/ new 'name'
    if (keyName) {
      message = `The keyName: '${keyName}' for labelId: ${labelId} found; '${labelName}' will be ${labelAction}`;
      actionAddOn = ' / found';
    } else {
      // If the 'labelId' is not found, create a new 'keyName' and flag this label edit for review
      keyName = createKeyName(data, labelName);
      message = `A keyName for labelId: ${labelId} not found in JSON! Adding new keyName: ${keyName} to \`label-directory.json\``;
      actionAddOn = ' / added';
    }
    writeToJsonFile(filepath, data, keyName, labelId, labelName);
  }

  // If 'created' then 'keyName' won't exist, create new camelCased 'keyName' so label entry can be added to directory
  if (labelAction === 'created') {
    keyName = createKeyName(data, labelName);
    writeToJsonFile(filepath, data, keyName, labelId, labelName);
  }

  // Final step is to return labelPacket to workflow
  console.log(`\nCreating labelPacket to send to Google Apps Script file`);
  labelAction += labelAddOn;
  return { labelAction, keyName, labelName, labelId, message };
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



function writeToJsonFile(filepath, data, keyName, labelId, labelName) {
  data[keyName] = [labelId, labelName];                                                                 // Needs Try-catch
  console.log(`\nWriting label data to directory:\n { "${keyName}": [ "${labelId}", "${labelName}" ] }\n`);
  
  // Write data file in prep for committing changes to label directory
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log(`-------------------------------------------------------`);
    console.log(`Changes to \`label-directory.json\` have been staged. Next step will commit changes.`);
  });  
}




module.exports = main;
