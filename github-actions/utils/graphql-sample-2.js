// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c

 /*
  const {
    viewer: { login },
  } = await github.graphql(`
    query {
      viewer {
        login
      }
    }`);

  console.log('test');
  console.log(`viewer = ${viewer}`);
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
  */


  const query = `
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
  `;

  let init_results = await github.graphql(query, {
    owner: "t-will-gillis",
    repo: "website",
    });
  let final_results = init_results.repository.issues.edges;
  console.log("attempt using 'init_results.repository.issues.edges'");
  for (let result in final_results) {
    console.log(result);
  }
  return init_results;
    
}

module.exports = main;
