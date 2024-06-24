
// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c

  const { allIssues } = await github.graphql(
    `
      query {
        organization(owner:"hackforla"){
          projectV2(id:"PVT_kwDOALGKNs4Ajuck"){
            items(first:10 ){
              pageInfo{ hasNextPage }
              nodes{
                fieldValueByName(name:"Status"){
                  __typename
                  ... on ProjectV2ItemFieldSingleSelectValue{
                    name
                  }
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
    `,
      {
        owner: "hackforla",
        repo: "website",
      }
    );
  
  console.log(allIssues);
}


module.exports = main;
