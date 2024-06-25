
// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c

  const { allIssues } = await github.graphql(
    `
      query {
        organization(login:"hackforla"){
          projectV2(number:86){
            items(first:10 ){
              pageInfo{ hasNextPage }
              nodes{
                fieldValueByName(name:"Status"){
                  __typename
                  ... on ProjectV2ItemFieldSingleSelectValue{
                    id
                    name
                  }
                }
                content{
                  __typename
                  ... on Issue{
                    number
                    title
                    id
                  }
                }
              }
            }
          }
        }
      }
    `
  );
  
  console.log(`line 49`);
  console.log(JSON.parse(allIssues));
  console.log(`line 51`);
  console.log(allIssues.data);
  console.log(`line 53`);
}


module.exports = main;
