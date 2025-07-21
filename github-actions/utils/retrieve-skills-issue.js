
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
        per_page: 10,
    });
/*
    console.log('First few issues with their labels:');
    issueData.data.slice(0, 5).forEach((issue, index) => {
    console.log(`Issue ${index + 1} (#${issue.number}):`, 
        issue.labels.map(label => label.name)
    );
    });

    // Look for any labels that contain "Prework" (case-insensitive)
    const preworkLabels = new Set();
    issueData.data.forEach(issue => {
    issue.labels.forEach(label => {
        if (label.name.toLowerCase().includes('prework')) {
        preworkLabels.add(label.name);
        }
    });
    });
    console.log('All labels containing "prework":', [...preworkLabels]);

    // Look for any labels that contain "Complexity"
    const complexityLabels = new Set();
    issueData.data.forEach(issue => {
    issue.labels.forEach(label => {
        if (label.name.toLowerCase().includes('complexity')) {
        complexityLabels.add(label.name);
        }
    });
    });
    console.log('All labels containing "complexity":', [...complexityLabels]);

    // Try the original search
    const skillsIssueNum = issueData.data.find(issue => 
    issue.labels.some(label => label.name === "Complexity: Prework")
    )?.number || null;

    console.log('Skills issue number:', skillsIssueNum);

    // Try case-insensitive search as backup
    const skillsIssueNumCaseInsensitive = issueData.data.find(issue => 
    issue.labels.some(label => label.name.toLowerCase() === "complexity: prework")
    )?.number || null;

    console.log('Skills issue number (case-insensitive):', */
    // const skillsIssueNum = issueData.data.find(issue => issue.labels.some(label => label.name === "Complexity: Prework"));
    // console.log(`FOUND IT?: ${skillsIssue.number}`)
    const skillsIssueNum = issueData.data.find(issue => issue.labels.some(label => label.name === "Complexity: Prework")
    )?.number || null;

    console.log('Skills issue number:', skillsIssueNum);
    return skillsIssueNum;

}


module.exports = retrieveSkillsIssue;
