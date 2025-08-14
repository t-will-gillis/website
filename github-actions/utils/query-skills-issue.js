/**
 * @description Query for Skills Issue information using assignee and label
 * @param {Object} github    - GitHub object from function calling queryIssueInfo()
 * @params {Object} context  - Context of the function calling queryIssueInfo()
 * @params {String} assignee - The GitHub username of the assignee
 * @params {String} label    - The label to filter issues by (e.g., "Complexity: Prework")
 * @returns {Object}         - An object containing the item ID and its status name
 */
async function querySkillsIssue(github, context, assignee, label) {
  const repoOwner = context.repo.owner;
  const repoName = context.repo.repo;

  const query = `query($owner: String!, $repo: String!, $assignee: String!, $label: String!) {
    repository(owner: $owner, name: $repo) {
     issues(
      first: 5
      filterBy: {assignee: $assignee, labels: [$label]}
      states: [OPEN, CLOSED]
    ) {
      nodes {
        number
        projectItems(first: 5) {
          nodes {
            id
            project {
              id
              title
            }
            fieldValues(first: 10) {
              nodes {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  optionId
                }
              }
            }
          }
        }
      }
    }
  }`;

  const variables = {
    owner: repoOwner,
    repo: repoName,
    assignee: assignee,
    label: label
  };

  console.log(repoOwner);
  console.log(repoName);
  console.log(assignee);
  console.log(label);
  
  try {
    const response = await github.graphql(query, variables);

    // Extract the list of project items associated with the issue
    const issueNum = response.repository.issues.nodes[0]?.number || null;

    // Get issue's global ID and status name and ID
    const projectData = response.repository.issue.projectItems.nodes;
    const id = projectData[0].id;

    // Iterate through the field values of the first project item and find the nodes
    // for 'name' and 'optionId' properties, then get 'statusName' and 'statusId'
    const fieldValues = projectData[0].fieldValues?.nodes || [];

    const statusNameNode = fieldValues.find((item) =>
      item.hasOwnProperty("name")
    );
    const statusIdNode = fieldValues.find((item) =>
      item.hasOwnProperty("optionId")
    );

    const statusName = statusNameNode?.name || "Unknown Status";
    const statusId = statusIdNode?.optionId || null;

    return { issueNum, id, statusName, statusId };
  } catch (error) {
    // If an error occurs, log it and return an object with null values
    console.error(`Error querying skills issue: ${error.message}`);
    return {
      issueNum: null,
      id: null,
      statusName: "Unknown Status",
      statusId: null,
    };
  }
}

module.exports = querySkillsIssue;

