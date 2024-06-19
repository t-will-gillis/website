// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c
  
  const {
    viewer: { login },
  } = await github.graphql(`{
    viewer {
      login
    }
  }`);
