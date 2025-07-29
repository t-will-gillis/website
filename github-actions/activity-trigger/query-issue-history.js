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
  let issueNum = 8250;

  const issueQuery = `query($owner: String!, $repo: String!, $issueNum:Int!) {
    repository(owner: $owner, name: $repo) {
      issue(number: $issueNum) {
        title
        author { login }
        createdAt
        url
        timelineItems(first: 100) {
          nodes {
            __typename
            ... on ClosedEvent {
              actor { login }
              createdAt
              stateReason
              url
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
              url
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
        url
        timelineItems(first: 100) {
          nodes {
            __typename
            ... on PullRequestReview {
              createdAt
              author { login }
              url
            }
            ... on ClosedEvent {
              actor { login }
              createdAt
              stateReason
              url
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
    
    // Extract the issueAuthor, issueCreated date, and issueUrl
    let issueAuthor = response.repository.issue.author.login;
    let issueCreated = response.repository.issue.createdAt;
    let issueUrl = response.repository.issue.url;
    history.push([issueAuthor, 'OpenedEvent', issueNum, issueUrl, issueCreated]);
    
    // Get timelineItems and then iterate and extract relevant info
    const timelineItems = response.repository.issue.timelineItems.nodes;
    const relevantTypes = new Set([
      'AssignedEvent',
      'UnassignedEvent',
      'IssueComment',
      'ClosedEvent'
    ]);

    // Iterate through the field values of the timeline to extract actors, events, timelines
    timelineItems.filter(item => relevantTypes.has(item.__typename)).map(item => {    
      const { __typename, createdAt } = item;
  
      let actor = '';
      let reason = '';
      let issueEvent = __typename;
  
      if (__typename === 'AssignedEvent' || __typename === 'UnassignedEvent') {
        actor = item.assignee.login;
      } else if (__typename === 'IssueComment') {
        actor = item.author.login;
        issueUrl = item.url;
      } else if (__typename === 'ClosedEvent') {
        actor = item.actor.login;
        issueUrl = item.url;
        reason = item.stateReason;
        issueEvent = 'ISSUE_'+ reason;
      }
      history.push([actor, issueEvent, issueNum, issueUrl, createdAt]);
    });

    console.log(history);
    return history;
    
  } catch (issueError) {
    console.warn('issueQuery failed, trying prQuery...', issueError.message);

    // If issueQuery fails, proceed with prQuery
    try {
      response = await github.graphql(prQuery, variables);

      // Extract the prAuthor, createdAt date, and url
      let prAuthor = response.repository.pullRequest.author.login;
      let prCreated = response.repository.pullRequest.createdAt;
      let prUrl = response.repository.pullRequest.url;
      history.push([prAuthor, 'OpenedEvent', issueNum, prUrl, prCreated]);
  
      
      // Get timelineItems and then iterate and extract relevant info
      const timelineItems = response.repository.pullRequest.timelineItems.nodes;
      const relevantTypes = new Set([
        'PullRequestReview',
        'ClosedEvent'
      ]);
  
      // Iterate through the timeline field values to extract actors, events, timelines
      timelineItems.filter(item => relevantTypes.has(item.__typename)).map(item => {    
        const { __typename, createdAt } = item;
    
        let actor = '';
        let reason = '';
        let prEvent = __typename;
    
        if (__typename === 'PullRequestReview') {
          actor = item.author.login;
          prUrl = item.url;
        } else if (__typename === 'ClosedEvent') {
          actor = item.actor.login;
          prUrl = item.url;
          reason = item.stateReason;
          prEvent = 'PR_'+ reason;
        }
        history.push([actor, prEvent, issueNum, prUrl, createdAt]);
      });
  
      console.log(history);
      return history;
      
    } catch (prError) {
      console.error('Both issueQuery and prQuery failed.');
      throw new Error(`GraphQL query failed:\n- Issue error: ${issueError.message}\n- PR error: ${prError.message}`);
    }
  }
}

module.exports = queryIssueHistory;
