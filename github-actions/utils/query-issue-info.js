/**
 * @description - Get item info using its issue number
 * @params {Object} context  - Context of the function calling getItemInfo()
 * @returns {Object}         - An object containing the item ID and its status name
 */
async function queryIssueInfo(issueNum, github, context) {

  // const { owner, repo } = context.repo;
  // let issueNum = context.payload.issue.number;
  
  console.log(context.repo.owner);
  console.log(context.repo.repo);
  console.log(issueNum);
  
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
    issueNum: issueNum
  };
/*
  try { 
    const response = await github.graphql(query, variables);
    console.log(response);
    // Extract the list of project items associated with the issue
    const projectItems = response.repository.issue.projectItems.nodes;
    console.log(projectItems);
    // Since there is always one item associated with the issue,
    // directly get the item's ID from the first index
    const id = projectItems[0].id;

    // Iterate through the field values of the first project item
    // and find the node that contains the 'name' property, then get its 'name' value
    const statusName = projectItems[0].fieldValues.nodes.find(item => item.hasOwnProperty('name')).name;
    console.log(`status ${statusName}`);
    // console.log(`Success! For Issue #${ISSUE_NUMBER}, found id = '${id}' and status = '${statusName}'`);
    return { id, statusName };
  } catch(error) {
    throw new Error(`Error finding Issue #${issueNum} id and status; error = ${error}`);
  }

*/
  
  const response = await github.graphql(query, variables);
  console.log(response);
  // Extract the list of project items associated with the issue
  const projectItems = response.repository.issue.projectItems.nodes;
  console.log('here ffffff');
  console.log(projectItems.length);
  console.log(projectItems);
  for (item in projectItems) {
    console.log(item);
  }
 
  // Since there is always one item associated with the issue,
  // directly get the item's ID from the first index
  // const id = projectItems[0].id;
  
  // Iterate through the field values of the first project item
  // and find the node that contains the 'name' property, then get its 'name' value
  const statusName = projectItems[0].fieldValues.nodes.find(item => item.hasOwnProperty('name')).name;
  console.log(`status ${statusName}`);
  // console.log(`Success! For Issue #${ISSUE_NUMBER}, found id = '${id}' and status = '${statusName}'`);
  return { id, statusName };
  
}

module.exports = queryIssueInfo;
