/**
 * Function to return node id for issue
 * @param {Object} github     - github object from actions/github-script
 * @param {Object} context    - context object from actions/github-script
 * @param {Int} issueNum      - the issue number
 * @returns {String} issueId  - the issue's node id for use in GraphQL
 */
async function getIssueId(github, context, issueNum) {

  // Ref: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#get-an-issue
  const issueResults = await github.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issueNum
  });

  const issueId = issueResults.data.node_id;
  return issueId;  
}

module.exports = getIssueId;
