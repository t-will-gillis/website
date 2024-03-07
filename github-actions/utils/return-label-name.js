// Global variables
var github;
var context;

async function main({ g, c }) {
  github = g;
  context = c;

  const labelNameNew = context.payload.label.name;
  const labelId = context.payload.label.id

  console.log('****************************************************');
  console.log(context);
  console.log('****************************************************');
  console.log('****************************************************');
  console.log('1' + context.payload.label);
  console.log('2' + context.payload.label.id);
  console.log('3' + context.payload.label.name);
  console.log('4' + context.payload.event.changes);
  console.log('5' + context.payload.changes);
  console.log('****************************************************');


  
  // Retrieve lists data from json file written in previous step
  // let parsedEvent = JSON.parse(artifactContent);

  // console.log('**********************************************');
  // console.log(parsedEvent);




  
}


module.exports = main;
