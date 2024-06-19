// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c

  let login = context.repo.owner;
  console.log(`Login = {login}`);
  
  const {
    viewer: { login },
  } = await github.graphql(`{
    viewer {
      login
    }
  }`);

  console.log('test');
  console.log(viewer);
}

module.exports = main;
