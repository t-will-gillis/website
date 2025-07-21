
/**
 * Helper function to retrieve actor's Skills Issue
 * @param {Array} eventActor          - Key reference to look up user's Skill Issue
 * @return {Array} skillsIssueNum   - Corres. Skills Issue for user
 */
async function retrieveSkillsIssue(eventActor) {

    // https://docs.github.com/en/rest/issues/labels?apiVersion=2022-11-28#list-repository-issues
    const issueData = await github.request('GET /repos/{owner}/{repo}/issues', {
        // owner: context.repo.owner,
        owner: 'hackforla',
        repo: context.repo.repo,
        assignee: eventActor,
        state: 'all',
        direction: 'asc',
        per_page: 5,
    });

    const skillsIssueNum = issueData.data.find(issue => issue.labels.some(label => label.name === "Complexity: Prework"));
    console.log(`FOUND IT: ${issueData.data.number}`)

    return skillsIssueNum ? issueData.data.number : null;

}


module.exports = retrieveSkillsIssue;
