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
              fieldValues(first: 1) {
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
    const issueNode = response.repository.issues.nodes[0];  
    const issueNum = issueNode.number;
    
    const id = issueNode.projectItems.nodes[0]?.id;  
    
    const projectItem = issueNode.projectItems.nodes[0];
    const fieldNode = projectItem?.fieldValues.nodes?.find(
      node => typeof node.name === 'string' && typeof node.optionId === 'string'
    );
    
    const statusName = fieldNode?.name ?? null;
    const statusId = fieldNode?.optionId ?? null;

    
    console.log(issueNum);
    console.log(id);
    console.log(statusName);
    console.log(statusId);
    
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

