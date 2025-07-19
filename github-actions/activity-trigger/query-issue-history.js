/**
 * @description - Get item history using its issue number
 * @param {Object} github    - GitHub object from function calling queryIssueInfo()
 * @param {Object} context   - Context of the function calling queryIssueInfo()
 * @returns {Object}         - An object containing user activity history for issue
 */
async function queryIssueHistory(github, context, issueNum) {
  const repoOwner = 'hackforla';
  const repoName = 'website';

  const query = `query ($owner: String!, $repo: String!, $issueNum:Int!) {
  repository(owner: $owner, name: $repo) {
    issue(number: $number) {
      author { login }
      createdAt
      timelineItems(first: 100) {
        nodes {
          __typename
          ... on ClosedEvent {
            actor { login }
            createdAt
            stateReason
          }
          ... on AssignedEvent {
            createdAt
            assignee { ... on User { login } }
          }
          ... on UnassignedEvent {
            createdAt
            assignee { ... on User { login } }
          }
        }
      }
    }
    pullRequest(number: $number) {
      author { login }
      createdAt
      timelineItems(first: 100) {
        nodes {
          __typename
          ... on PullRequestReview {
            createdAt
            author { login }
          }
          ... on ClosedEvent {
            actor { login }
            createdAt
            stateReason
          }
        }
      }
    }
  }
}`;

  const variables = {
    owner: repoOwner,
    repo: repoName,
    issueNum: 7610,
  };

  try {
    const response = await github.graphql(query, variables);
    console.log(response)
    
    /*
    // Extract the list of project items associated with the issue
    const projectData = response.repository.issue.projectItems.nodes;

    // Since there is always one item associated with the issue,
    // directly get the item's ID from the first index
    const id = projectData[0].id;

    // Iterate through the field values of the first project item
    // and find the node that contains the 'name' property, then get its 'name' value
    const statusName = projectData[0].fieldValues.nodes.find((item) => 
      item.hasOwnProperty("name")).name;
    
    // Similarly, find node with 'optionId' property, then get is 'optionId' value
    const statusId = projectData[0].fieldValues.nodes.find((item) => 
      item.hasOwnProperty("optionId")).optionId;
  
    return { id, statusName, statusId };
    */

  } catch (error) {
    throw new Error(`Error finding Issue #${issueNum} id and status; error = ${error}`);
  }
}

module.exports = queryIssueHistory;
