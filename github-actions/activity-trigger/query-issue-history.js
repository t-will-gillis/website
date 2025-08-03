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
  
  let history = [];
  
  let start = 5028;
  let end = 5028;
  for (let i = start; i <= end; i++) {
    let issueNum = i;
  
    const issueQuery = `query($owner: String!, $repo: String!, $issueNum:Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $issueNum) {
          title
          author { login }
          createdAt
          url
          closedByPullRequestsReferences(first: 1) {
            nodes {
              number
            }
          }
          timelineItems(first: 100) {
            nodes {
              __typename
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
              ... on ClosedEvent {
                actor { login }
                createdAt
                stateReason
                url
              }
              ... on ReopenedEvent {
                actor { login }
                createdAt
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
          state
          timelineItems(first: 100) {
            nodes {
              __typename
              ... on PullRequestReview {
                createdAt
                author { login }
                url
              }
              ... on IssueComment {
                author { login }
                createdAt
                url
              }
              ... on ClosedEvent {
                actor { login }
                createdAt
                url
              }
              ... on ReopenedEvent {
                actor { login }
                createdAt
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
  

    let response;

    // Return immediately if the issueNum is a Skills Issue
    const isSkillsIssue = await checkIfSkillsIssue(issueNum);
    if (isSkillsIssue) {
        console.log(`issueNum: ${issueNum} identified as Skills Issue`);
        continue;
    }
    
    try {
      response = await github.graphql(issueQuery, variables);
      
      // Extract the issueAuthor, issueCreated date, and issueUrl
      let eventActor = response.repository.issue.author.login;
      let createdAt = response.repository.issue.createdAt;
      let issueUrl = response.repository.issue.url;
      let closedByPr = response.repository.issue.closedByPullRequestsReferences.nodes.number;
      let message = `@ ${eventActor} has opened an issue: #[${issueNum}](${issueUrl}) at ${createdAt}`;
      history.push([eventActor, createdAt, message]);
      
      // Get timelineItems and then iterate and extract relevant info
      const timelineItems = response.repository.issue.timelineItems.nodes;
      const relevantTypes = new Set([
        'AssignedEvent',
        'UnassignedEvent',
        'IssueComment',
        'ClosedEvent',
        'ReopenedEvent'
      ]);
  
      let assignee = '';
      let reason = '';

      // Iterate through the field values of the timeline to extract actors, events, timelines
      timelineItems.filter(item => relevantTypes.has(item.__typename)).map(item => {    
        const { __typename, createdAt } = item;

        let issueEvent = __typename;
    
        if (issueEvent === 'AssignedEvent') {
          assignee = item.assignee.login;
          eventActor = assignee;
        } else if (issueEvent === 'UnassignedEvent') {
          eventActor = item.assignee.login;
        } else if (issueEvent === 'IssueComment') {
          eventActor = item.author.login;
          issueUrl = item.url;
        } else if (issueEvent === 'ClosedEvent') {
          // If assignee exists, eventActor --> assignee
          eventActor = assignee || item.actor.login;
          issueUrl = item.url;
          reason = item.stateReason;
          issueEvent = closedByPr ? 'IssueCLOSEDbyPR' : 'Issue'+ reason;
        } else if (issueEvent === 'ReopenedEvent') {
          eventActor = item.actor.login; 
        }
  
        const actionMap = {
          'AssignedEvent': 'been assigned to an issue',
          'UnssignedEvent': 'been unassigned from an issue',
          'IssueComment': 'commented on an issue',
          'IssueCLOSEDbyPR': 'had an issue closed by PR ' + closedByPr,
          'IssueCOMPLETED': 'closed an issue as completed',
          'IssueNOT_PLANNED': 'closed an issue as not planned',
          'IssueDUPLICATE': 'closed an issue as duplicate',
          'ReopenedEvent': 'has reopened an issue',
        };
        const action = actionMap[`${issueEvent}`];
        message = `@ ${eventActor} has ${action}: #[${issueNum}](${issueUrl}) at ${createdAt}`;
  
        history.push([eventActor, createdAt, message]);
      });
      
    } catch (issueError) {
      console.warn('issueQuery failed, trying prQuery...', issueError.message);
  
      // If issueQuery fails, proceed with prQuery
      try {
        response = await github.graphql(prQuery, variables);
  
        // Extract the prAuthor, createdAt date, and url
        let eventActor = response.repository.pullRequest.author.login;
        let createdAt = response.repository.pullRequest.createdAt;
        let prUrl = response.repository.pullRequest.url;
        let closeState = response.repository.pullRequest.state;
        let message = `@ ${eventActor} has opened a pull request: #[${issueNum}](${prUrl}) at ${createdAt}`;
        history.push([eventActor, createdAt, message]);
    
        // Get timelineItems and then iterate and extract relevant info
        const timelineItems = response.repository.pullRequest.timelineItems.nodes;
        const relevantTypes = new Set([
          'PullRequestReview',
          'IssueComment',
          'ClosedEvent',
          'ReopenedEvent',
        ]);
    
        // Iterate through the timeline field values to extract actors, events, timelines
        timelineItems.filter(item => relevantTypes.has(item.__typename)).map(item => {    
          const { __typename, createdAt } = item;
      
          let prActor = '';
          let reason = '';
          let prEvent = __typename;
      
          if (prEvent === 'PullRequestReview') {
            eventActor = item.author.login;
            prUrl = item.url;
          } else if (prEvent === 'IssueComment') {
            eventActor = item.author.login;
            prUrl = item.url;
          } else if (prEvent === 'ClosedEvent') {
            // eventActor is the PR author, not merge team
            eventActor = response.repository.pullRequest.author.login;
            prUrl = item.url;
            prEvent = 'PullRequest'+ closeState;
          } else if (prEvent === 'ReopenedEvent') {
            eventActor = item.actor.login;
          }
          const actionMap = {
            'PullRequestReview': 'submitted a pull request review',
            'IssueComment': 'commented on a pull request',
            'PullRequestCLOSED': 'had a pull request closed w/o merging',
            'PullRequestMERGED': 'had a pull request merged',
            'ReopenedEvent': 'has reopened a pull request'
          };
          const action = actionMap[`${prEvent}`];
          message = `@ ${eventActor} has ${action}: #[${issueNum}](${prUrl}) at ${createdAt}`;
          history.push([eventActor, createdAt, message]);
        });
        
      } catch (prError) {
        console.warn('prQuery failed also, skipping issue...', issueError.message);
        continue
      }
    }
  }
    async function checkIfSkillsIssue(issueNum) {
      try {
        // https://docs.github.com/en/rest/issues/labels?apiVersion=2022-11-28#list-labels-for-an-issue
        const labelData = await github.request('GET /repos/{owner}/{repo}/issues/{issue_number}/labels', {
            owner: 'hackforla',
            repo: 'website',
            issue_number: issueNum
        });
        const isSkillsIssue = labelData.data.some(label => label.name === "Complexity: Prework");
        return isSkillsIssue;
      } catch (err) {
        console.log(`issueNum: ${issueNum} some error occured: `);
        return true;
      }
     
  }
  return JSON.stringify(history);
}

module.exports = queryIssueHistory;
