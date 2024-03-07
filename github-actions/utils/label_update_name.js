const fs = require('fs');

// Global variables
var github;
var context;

async function main({ g, c }) {
  github = g;
  context = c;

  // const labelNameNew = context.payload.label.name;
  const labelId = context.payload.label.id

  console.log('****************************************************');
  console.log(context.payload.label);
  console.log('label id ********************************************');
  console.log(context.payload.label.id);
  console.log('label name ******************************************');
  console.log(context.payload.label.name);
  console.log('payload changes *************************************');
  console.log(context.payload.changes);
  console.log('****************************************************');
  if(context.payload.changes.name) {

    
    // Retrieve label directory
    const filepath = './_data/label_directory.json';
    const rawData = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(rawData);
    
    const prevName context.payload.changes.name.from;
    console.log('Name changed!!!!);
    console.log(prevName);

    
  } else {
    console.log('    did not change name');
  } 

 
}


module.exports = main;
