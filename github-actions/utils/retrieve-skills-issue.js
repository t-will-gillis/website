
/**
 * Helper function to retrieve actor's Skills Issue
 * @param {Array} eventActor        - Key reference to look up user's Skill Issue
 * @return {Array} skillsIssueNum   - Corres. Skills Issue for user
 */
async function retrieveSkillsIssue(eventActor) {

    // https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
    const issueData = await github.request('GET /repos/{owner}/{repo}/issues', {
        owner: context.repo.owner,
        repo: context.repo.repo,
        assignee: eventActor,
        state: 'all',
        direction: 'asc',
        per_page: 10,
    });

    // Find issue with the prework label, then extract issueNum and node_id
    const skillsIssue = issueData.data.find(issue => issue.labels.some(label => label.name === "Complexity: Prework"));
    const skillsIssueNum = skillsIssue ? skillsIssue.number : null;
    const skillsIssueNodeId = skillsIssue ? skillsIssue.node_id : null;
    
    console.log(`Found skills issue: ${skillsIssueNum}`);

    return {skillsIssueNum, skillsIssueNodeId};
}

module.exports = retrieveSkillsIssue;
