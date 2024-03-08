const fs = require('fs');

// Global variables
var github;
var context;

async function main({ g, c }) {
  github = g;
  context = c;

 
  const labelId = context.payload.label.id + '';
  const labelName = context.payload.label.name;

  console.log('-----------------------------------------------------------------------');
  console.log('Context and current info for edited label: ');
  console.log(context.payload.label);
  console.log('-----------------------------------------------------------------------');
  console.log('What was changed: ');
  console.log(context.payload.changes);
  console.log('-----------------------------------------------------------------------');
  
  if(context.payload.changes.name) {

    // Retrieve label directory
    const filepath = 'github-actions/utils/_data/label_directory.json';
    const rawData = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(rawData);
    
    const prevName = context.payload.changes.name.from;
    console.log('Name changed!!!!');
    console.log(labelId);
    console.log(prevName);
    console.log(labelName);
    console.log(data['draft']);
    for(let [key, value] of Object.entries(data)) {
      if (value.includes(labelId)) {
        const keyName = key;
        console.log('Changing label name value:\n   Reference Name: ' + keyName + '\n   Previous Name: ' + prevName + '\n   Edited Name: ' + labelName);

        // Write new data to label directory
        data[key] = [labelId, labelName];
        fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
          if (err) throw err;
          console.log('-------------------------------------------------------');
          console.log("File 'label-directory.json' saved successfully!");
        });
        break;
      } 
    }
  } else {
    console.log('Label name was not changed');
  } 
}



module.exports = main;
