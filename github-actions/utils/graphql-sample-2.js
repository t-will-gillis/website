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
      repository (owner: $owner, name: $repo) {
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

  let raw_data = await github.graphql(query, {
    owner: context.repo.owner,
    repo: context.repo.repo,
    });
  let edges = raw_data.repository.issues.edges;

  for (let edge in edges) {
    console.log(edge.node.title);
  }
  return results;
    
}

module.exports = main;
