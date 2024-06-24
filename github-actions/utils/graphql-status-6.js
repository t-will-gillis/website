
// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c

  const { allIssues } = await github.graphql(
    `
      query {
        organization(login: "hackforla") {
          projectV2(number:86) {
            items(last: 10) {
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
