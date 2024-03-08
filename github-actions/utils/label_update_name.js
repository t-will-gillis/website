const fs = require('fs');

// Global variables
var github;
var context;

async function main({ g, c }) {
  
  github = g;
  context = c;

  // Proceed only if the label name changed
  if(context.payload.changes.name) {

    const labelId = context.payload.label.id + '';
    const labelName = context.payload.label.name;
    const prevName = context.payload.changes.name.from;
    
    console.log('-----------------------------------------------------------------------');
    console.log('Context and current info for edited label: ');
    console.log(context.payload.label);
    console.log('-----------------------------------------------------------------------');
    console.log('What was changed: ');
    console.log(context.payload.changes);
    console.log('-----------------------------------------------------------------------');
    
    // Retrieve label directory
    const filepath = 'github-actions/utils/_data/label_directory.json';
    const rawData = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(rawData);
    let keyName = '';

    // Check if labelId exists in label directory, if so, set keyName
    for(let [key, value] of Object.entries(data)) {
      if (value.includes(labelId)) {
        keyName = key;
        data[keyName] = [labelId, labelName];
        break;
      }
    };
    console.log('test- this is value of keyName: ' + keyName); 
    // If labelId does not exist, create new (camelCased) keyName so label entry can be added to directory
    if (keyName = '') {
      let labelInterim = labelName.split(/[^a-zA-Z0-9]+/);
      for(let i = 0; i < labelInterim.length ; i++) {
          if(i === 0) {
              keyName += labelInterim[0].toLowerCase();
          } else if(isAlphanumeric(labelInterim[i])) {
              keyName += labelInterim[i].split(' ').map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');
          }
      }
      data[keyName] = [labelId, labelName];
      console.log('blank keyname, now keyName: ' + keyName);
    };
    
    console.log('test- this is value of keyName: ' + keyName); 
    // Log the entry, then save to data file
    console.log('Writing data ==> "' + keyName + '": ["' + labelId + '", "' + labelName + '"]\n');
    

    // Write data file in prep for committing changes to label directory
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      if (err) throw err;
      console.log('-------------------------------------------------------');
      console.log("File 'label-directory.json' saved successfully!");
    });
    
  } else {
    console.log('Label name was not changed');
  } 
}


module.exports = main;
