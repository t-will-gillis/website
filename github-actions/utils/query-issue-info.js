/**
 * @description - Get item info using its issue number
 * @returns {Object} - An object containing the item ID and its status name
 */
async function getItemInfo() {
  try {
    const query = `query($owner: String!, $repo: String!, $issueNum: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $issueNum) {
          id
          projectItems(first: 100) {
            nodes {
              id
              fieldValues(first: 100) {
                nodes {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }`;

    const variables = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issueNum: context.payload.issue.number
    };

    const response = await github.graphql(query, variables);

    // Extract the list of project items associated with the issue
    const projectItems = response.repository.issue.projectItems.nodes;
    
    // Since there is always one item associated with the issue,
    // directly get the item's ID from the first index
    const id = projectItems[0].id;

    // Iterate through the field values of the first project item
    // and find the node that contains the 'name' property, then get its 'name' value
    const statusName = projectItems[0].fieldValues.nodes.find(item => item.hasOwnProperty('name')).name;

    return { id, statusName };
  } catch(error) {
    throw new Error("Error updating item's status: " + error);
  }
}

module.exports = getItemInfo;
