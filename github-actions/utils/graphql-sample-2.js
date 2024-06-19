// Global variables
var github
var context


const {
  viewer: { login },
} = await github.graphql(`{
  viewer {
    login
  }
}`);
