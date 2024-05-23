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

  // If the action is 'edited' but does not involve changing the name, label directory is not affected
  if (context.payload.action === 'edited' && !context.payload.changes.name) {
    logLabelAction(); 
    console.log(`\nThe file \`label-directory.json\` was not updated!`);
    return;
  } 

  // Otherwise, retrieve label directory 
  const filepath = 'github-actions/utils/_data/label-directory.json';
  const rawData = fs.readFileSync(filepath, 'utf8');
  const data = JSON.parse(rawData);
  let keyName = '';

  // Check for 'labelId' in label directory and return 'keyName', other
  if (context.payload.action === 'edited' || context.payload.action === 'deleted') {
    for (let [key, value] of Object.entries(data)) {
      if (value.includes(labelId)) {
        console.log(`${labelId} found; '${labelName}' will be ${context.payload.action}`);
        keyName = key;
        break;
      }
    }
    // If 'labelId' not found, the 'keyName' will need to be created
    if (!keyName) { 
      console.log(`${labelId} not found!`);
      keyName = createKeyName();
    }
  }

    
  // If 'labelId' does not exist, create new camelCased 'keyName' so label entry can be added to directory
  if (context.payload.action === 'created') {
    createKeyName();
  }

  // Update directory (delete, edit, or create) and log
  if(context.payload.action === 'deleted') {
    delete data[keyName];
    console.log('\nDeleted label:\n {"' + keyName + '": ["' + labelId + '", "' + labelName + '"]}\n');
  } else {
    data[keyName] = [labelId, labelName];
    console.log('\nWriting data:\n {"' + keyName + '": ["' + labelId + '", "' + labelName + '"]}\n');
  }

  // Write data file in prep for committing changes to label directory
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log('-------------------------------------------------------');
    console.log("File 'label-directory.json' saved. Next step will commit file.");
  });
}



function logLabelAction() {
  // Log the label information
  console.log('-------------------------------------------------------');
  console.log('Label reference info:');
  console.log(context.payload.label);
  console.log('-------------------------------------------------------');
  if(context.payload.action === 'edited') {
    console.log('What was changed:');
    console.log(context.payload.changes);
    console.log('-------------------------------------------------------');
  }
}



function postWarning() {
  console.log('in postWarning()- Temp message!');
}



function createKeyName() {
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
  console.log(`A new 'keyName' ${keyName} has been created.`);
  return keyName;
}

module.exports = main;
