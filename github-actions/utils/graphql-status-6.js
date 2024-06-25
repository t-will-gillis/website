
// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c

  /*
  const { allIssues } = await github.graphql(
    `
      query {
        user(login:"t-will-gillis"){
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
  
  console.log(`line 49`);
  console.log(JSON.parse(allIssues));
  console.log(`line 51`);
  console.log(allIssues.data);
  console.log(`line 53`);
  */
  /*
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
}
*/

const lotsaData = await github.graphql(
  `
    query($owner:String!, $name:String!, $number:Int!) {
      repository(owner:$owner, name:$name) {
        projectV2(number:$number){
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
    `,
    {
      owner: "t-will-gillis",
      name: "website",
      number: 5
    },
  );

  console.log(`line 109`);
  console.log(JSON.parse(lotsaData.data));

}

module.exports = main;
