// Global variables
var github;
var context;

async function main({ g, c }, artifactContent) {
  github = g;
  context = c;

  console.log(artifactContent);


  
  // Retrieve lists data from json file written in previous step
  // let parsedEvent = JSON.parse(artifactContent);

  // console.log('**********************************************');
  // console.log(parsedEvent);




  
}


module.exports = main;
