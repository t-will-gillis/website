
// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c

  const query = `
    query findIssuesAndSubfields($owner: String!, $repo: String!, $projectNumber: Int!, $num: Int=25, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        projectV2(number: $projectNumber) {
          items(first: $num, after: $cursor) {
            nodes{
              fieldValueByName(name:"Status") {
                __typename
                ... on ProjectV2ItemFieldSingleSelectValue {
                  id
                  name
                }
              }
              content{
                __typename
                ... on Issue {
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
  `;

  const variables = {
    owner: "hackforla",
    // owner: context.repo.owner,
    repo: context.repo.repo,
    projectNumber: 86,
  };
    
  try {
    const result = await github.graphql(query, variables);

    // Parse the returned data
    const items = result.repository.projectV2.items.nodes.map(node => ({
      issue: {
        number: node.content.number,
        title: node.content.title,
        id: node.content.id,
      },
      status: {
        id: node.fieldValueByName.id,
        name: node.fieldValueByName.name,
      }
    }));

    console.log('Parsed Items:', items);

    // Set output for use in other workflow steps
    context.setOutput('items', JSON.stringify(items));
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
  }

}

module.exports = main;
