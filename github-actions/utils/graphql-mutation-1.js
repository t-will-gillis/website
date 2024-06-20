// Example mutation to change column status

// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c


  const query = `
    query lastIssues($owner: String!, $repo: String!, $num: Int!) {
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
    num: 10,
    });
  let edges = raw_data.repository.issues.edges;

  for (let i = 0; i < edges.length; i++) {
    result = edges[i].node.title;
    console.log(`Issue title: ${result}`);
  }

}

module.exports = main;
