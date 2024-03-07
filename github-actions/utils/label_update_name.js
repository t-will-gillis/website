const fs = require('fs');

// Global variables
var github;
var context;

async function main({ g, c }) {
  github = g;
  context = c;

  // const labelNameNew = context.payload.label.name;
  const labelId = context.payload.label.id;
  const labelName = context.payload.name;

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
    console.log(prevName);
    console.log(labelName);
    
    for(let [key, value] of Object.entries(data)) {
      if (value.includes(prevName)) {
        console.log('Changing label name value from: ' + prevName + ' to: ' + labelName);
        break;
      } else {
        console.log('Something went wrong!');
      }
    }
  } else {
    console.log('    did not change name');
  } 

 
}


module.exports = main;
