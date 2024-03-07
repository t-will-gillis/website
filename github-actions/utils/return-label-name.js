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
  console.log('1 ' + context.payload.label);
  console.log('2 ' + context.payload.label.id);
  console.log('3 ' + context.payload.label.name + '\n');
  console.log('4 ' + context.payload.changes);
  if(context.payload.changes.name){
    console.log('5 ' + context.payload.changes.name);
  } else {
    console.log('    did not change name');
  } 







  
}


module.exports = main;
