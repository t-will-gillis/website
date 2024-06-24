
// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c

  const { allIssues } = await github.graphql(
    `
      query allIssues($owner: String!, $repo: String!, $num: Int = 86) {
        repository(owner: $owner, name: $repo) {
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
      
      fragment issueDetails on Issue {
        number
        title
        id
      }
    
      fragment statusFieldDetails on ProjectV2ItemFieldSingleSelectValue {
        name
      }
    `,
      {
        owner: "hackforla",
        repo: "website",
      }
    );
  
  console.log(allIssues);
}


module.exports = main;
