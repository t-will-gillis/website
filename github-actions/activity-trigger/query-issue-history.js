/**
 * @description - Get item history using its issue number
 * @param {Object} github    - GitHub object from function calling queryIssueInfo()
 * @param {Object} context   - Context of the function calling queryIssueInfo()
 * @returns {Object}         - An object containing user activity history for issue
 */
async function queryIssueHistory({g, c}) {
  var github = g;
  var context = c;

  const repoOwner = 'hackforla';
  const repoName = 'website';
  let issueNum = 7610;

  const issueQuery = `query($owner: String!, $repo: String!, $issueNum:Int!) {
    repository(owner: $owner, name: $repo) {
      issue(number: $issueNum) {
        title
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
            ... on IssueComment {
              createdAt
              author { ... on User { login } }
            }
          }
        }
      }
    }
  }`;

  const prQuery = `query($owner: String!, $repo: String!, $issueNum:Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $issueNum) {
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
    issueNum
  };

  try {
    const response = await github.graphql(issueQuery, variables);
    console.log(response);
    
    // Extract the issue author and createdAt date
    const issueAuthor = response.repository.issue.author.login;
    const issueCreated = response.repository.issue.createdAt;
    console.log(issueAuthor);
    console.log(issueCreated);
    // Get timelineItems and then iterate
    const timelineItems = response.repository.issue.timelineItems;
    console.log(timelineItems);

    /*
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
