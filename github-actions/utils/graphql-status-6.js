// Example query to return status of issues
const fetch = require('node-fetch');

// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c

  const { allIssues } = await github.graphql(
    `
      query {
        user(login: "t-will-gillis") {
          projectV2(number:5) {
            items(last: 100) {
              pageInfo {
                hasNextPage
              }
              nodes {
                statusField: fieldValueByName(name: "Status") {
                  __typename
                  ...statusFieldDetails
                }
                content {
                  __typename
                  ... on Issue {
                    ...issueDetails
                  }
                }
              }
            }
          }
        }
      }
      
      fragment issueDetails on Issue {
        number
        title
        id
      }
    
      fragment statusFieldDetails on ProjectV2ItemFieldSingleSelectValue {
        name
      }
    `
    );
  
  console.log(allIssues);
}


module.exports = main;
