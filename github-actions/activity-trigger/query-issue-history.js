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
  let start = 8000;
  let end = 8025;
  for (let i = start; i <= end; i++) {
    let issueNum = i;
  
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

    // Return immediately if the issueNum is a Skills Issue
    const isSkillsIssue = await checkIfSkillsIssue(issueNum);
    if (isSkillsIssue) {
        console.log(`issueNum: ${issueNum} identified as Skills Issue`);
        continue;
    }
    
    try {
      response = await github.graphql(issueQuery, variables);
      
      // Extract the issueAuthor, issueCreated date, and issueUrl
      let issueAuthor = response.repository.issue.author.login;
      let issueCreated = response.repository.issue.createdAt;
      let issueUrl = response.repository.issue.url;
      let message = `@ ${eventActor} has opened an issue: #[${issueNum}](${eventUrl}) at ${timeline}`;
      history.push([issueAuthor, issueCreated, message]);
      
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
        } else if (__typename === 'UnassignedEvent') {
          actor = item.assignee.login;
        } else if (__typename === 'IssueComment') {
          actor = item.author.login;
          issueUrl = item.url;
        } else if (__typename === 'ClosedEvent') {
          actor = item.actor.login;
          issueUrl = item.url;
          reason = item.stateReason;
          issueEvent = 'Issue'+ reason;
        }
  
        const actionMap = {
          'IssueCOMPLETED': 'closed an issue as completed',
          'IssueNOT_PLANNED': 'closed an issue as not planned',
          'IssueDUPLICATE': 'closed an issue as duplicate',
          'AssignedEvent': 'been assigned to an issue',
          'UnssignedEvent': 'been unassigned from an issue',
          'IssueComment': 'commented on an issue or pr'
        };
        const action = actionMap[`${issueEvent}`];
        message = `@ ${eventActor} has ${action}: #[${issueNum}](${eventUrl}) at ${timeline}`;
  
        history.push([actor, createdAt, message]);
      });
  
      console.log(history);
      return JSON.stringify(history);
      
    } catch (issueError) {
      console.warn('issueQuery failed, trying prQuery...', issueError.message);
  
      // If issueQuery fails, proceed with prQuery
      try {
        response = await github.graphql(prQuery, variables);
  
        // Extract the prAuthor, createdAt date, and url
        let prAuthor = response.repository.pullRequest.author.login;
        let prCreated = response.repository.pullRequest.createdAt;
        let prUrl = response.repository.pullRequest.url;
        let message = `@ ${prAuthor} has opened a pull request: #[${issueNum}](${prUrl}) at ${prCreated}`;
        history.push([prAuthor, prCreated, message]);
    
        
        // Get timelineItems and then iterate and extract relevant info
        const timelineItems = response.repository.pullRequest.timelineItems.nodes;
        const relevantTypes = new Set([
          'PullRequestReview',
          'ClosedEvent'
        ]);
    
        // Iterate through the timeline field values to extract actors, events, timelines
        timelineItems.filter(item => relevantTypes.has(item.__typename)).map(item => {    
          const { __typename, createdAt } = item;
      
          let prActor = '';
          let reason = '';
          let prEvent = __typename;
      
          if (__typename === 'PullRequestReview') {
            prActor = item.author.login;
            prUrl = item.url;
          } else if (__typename === 'ClosedEvent') {
            prActor = item.actor.login;
            prUrl = item.url;
            reason = item.stateReason;
            prEvent = 'PullRequest'+ reason;
          }
          const actionMap = {
            'PullRequestCLOSED': 'had a pull request closed w/o merging',
            'PullRequestMERGED': 'had a pull request merged',
            'PullRequestReview': 'submitted a pull request review'
          };
          const action = actionMap[`${prEvent}`];
          message = `@ ${prActor} has ${action}: #[${issueNum}](${prUrl}) at ${createdAt}`;
  
          history.push([prActor, createdAt, message]);
        });
    
        console.log(history);
        return JSON.stringify(history);
        
      } catch (prError) {
        console.error('Both issueQuery and prQuery failed.');
        throw new Error(`GraphQL query failed:\n- Issue error: ${issueError.message}\n- PR error: ${prError.message}`);
      }
    }
  }
    async function checkIfSkillsIssue(issueNum) {
      // https://docs.github.com/en/rest/issues/labels?apiVersion=2022-11-28#list-labels-for-an-issue
      const labelData = await github.request('GET /repos/{owner}/{repo}/issues/{issue_number}/labels', {
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNum
      });
      const isSkillsIssue = labelData.data.some(label => label.name === "Complexity: Prework");

      return isSkillsIssue;
  }
}

module.exports = queryIssueHistory;
