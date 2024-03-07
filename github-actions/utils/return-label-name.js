// Global variables
var github;
var context;

async function main({ g, c }) {
  github = g;
  context = c;

  console.log('****************************************************');
  console.log(context);
  console.log('****************************************************');
  console.log('****************************************************');
  console.log(context.payload.label);
  console.log(context.payload.changes.color);
  console.log(context.payload.label.id);
  console.log('****************************************************');


  
  // Retrieve lists data from json file written in previous step
  // let parsedEvent = JSON.parse(artifactContent);

  // console.log('**********************************************');
  // console.log(parsedEvent);




  
}


module.exports = main;
