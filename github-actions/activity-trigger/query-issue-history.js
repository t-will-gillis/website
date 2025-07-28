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

  let history = [];
  let response;

  try {
    response = await github.graphql(issueQuery, variables);
    
    // Extract the issue author and createdAt date
    let issueAuthor = response.repository.issue.author.login;
    let issueCreated = response.repository.issue.createdAt;
    let issueUrl = response.repository.issue.url;
    history.push([issueAuthor, 'OpenedEvent', issueNum, issueUrl, issueCreated]);
    // console.log(issueAuthor);
    // console.log(issueCreated);
    
    // Get timelineItems and then iterate and extract relevant info
    const timelineItems = response.repository.issue.timelineItems.nodes;
    const relevantTypes = new Set([
      'AssignedEvent',
      'UnassignedEvent',
      'IssueComment',
      'ClosedEvent'
    ]);

    // Iterate through the field values of the first project item
    timelineItems.filter(item => relevantTypes.has(item.__typename)).map(item => {    
      const { __typename, createdAt } = item;
  
      let actor = null;
  
      if (__typename === 'AssignedEvent' || __typename === 'UnassignedEvent') {
        actor = item.assignee.login;
      } else if (__typename === 'IssueComment') {
        actor = item.author.login;
        issueUrl = item.url;
      } else if (__typename === 'ClosedEvent') {
        actor = item.actor.login;
        issueUrl = item.url;
      }
  
      history.push([actor, __typename, issueNum, issueUrl, createdAt]);
    });

    console.log(history);
    /*
    // and find the node that contains the 'name' property, then get its 'name' value
    const statusName = projectData[0].fieldValues.nodes.find((item) => 
      item.hasOwnProperty("name")).name;
    
    // Similarly, find node with 'optionId' property, then get is 'optionId' value
    const statusId = projectData[0].fieldValues.nodes.find((item) => 
      item.hasOwnProperty("optionId")).optionId;
  
    return { id, statusName, statusId };
    */
    
  } catch (issueError) {
    console.warn('issueQuery failed, trying prQuery...', issueError.message);
  
    try {
      response = await github.graphql(prQuery, variables);

      
    } catch (prError) {
      console.error('Both issueQuery and prQuery failed.');
      throw new Error(`GraphQL query failed:\n- Issue error: ${issueError.message}\n- PR error: ${prError.message}`);
    }
  }
}

module.exports = queryIssueHistory;
