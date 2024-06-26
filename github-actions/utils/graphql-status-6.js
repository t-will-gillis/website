
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
  
  console.log(login);
/*
  const { allIssues } = await github.graphql(
    `
      query allIssues{
        organization(login:"hackforla") {
          projectV2(number: 86) {
           field(name:"Status") { 
              ... on ProjectV2SingleSelectField { 	
              id options{ 
                  __typename
                  id 
                  name
                  ... on ProjectV2SingleSelectFieldOption {
                    name
                    description
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
*/

  const { lastIssues } = await github.graphql(
    `
      query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
        repository(owner: $owner, name: $repo) {
          issues(last: $num) {
            edges {
              node {
                title
              }
            }
          }
        }
      }
    `,
    {
      owner: "t-will-gillis",
      repo: "website",
    },
  );

  console.log(lastIssues);




const lotsaData = await github.graphql(
  `
    query lotsaData{
      repository(owner:"t-will-gillis", name:"website") {
        projectV2(number:5){
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

  console.log(`line 109`);
  console.log(JSON.parse(lotsaData.data));


}

module.exports = main;
