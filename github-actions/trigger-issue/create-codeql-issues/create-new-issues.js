const fs = require('fs');

// Global variables
var github;
var context;
// nonsense
/**
 * Creates new GitHub issues for each alert that doesn't have an existing issue.
 * @param {Object} options - The options object.
 * @param {string} options.g - The GitHub access token.
 * @param {Object} options.c - The context object.
 * @param {Array<number>} options.alertIds - The array of alert IDs to create issues for.
 * @returns {Promise<void>}
 * @throws {Error} If the POST request fails.
 */
const createNewIssues = async ({ g, c, alertIds }) => {
  // Rename parameters
  github = g;
  context = c;

  // Loop through each alertId
  for (const alertId of alertIds) {
    // Create the issue title
    const title = `Resolve CodeQL Alert #${alertId} - Generated by GHA`;

    // Read the issue body template file
    const issueBodyTemplatePath = 'github-actions/trigger-issue/create-codeql-issues/issue-body.md';
    let issueBodyTemplate = fs.readFileSync(issueBodyTemplatePath, 'utf8');

    // Replace placeholders with actual values in the issue body template
    const body = issueBodyTemplate.replace(/\${alertId}/g, alertId);

    // Create a new GitHub issue
    const createIssueResponse = await github.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title,
      body,
      labels: ['ready for dev lead']
    });      

    // Log issue titles and links in GHA workflow
    console.log('Issue Created:', createIssueResponse.data.title, createIssueResponse.data.html_url);

    // Throw error if POST request fails (201 not created)
    if (createIssueResponse.status !== 201) {
      throw new Error(`Failed to create issue for alert ${alertId}: ${createIssueResponse.status} - ${createIssueResponse.statusText}`);
    }
  }
};

module.exports = createNewIssues;
