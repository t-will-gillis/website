// Import modules
const fs = require('fs');

// Global variables
var filepath = 'github-actions/utils/_data/skills-issue-directory.json';
var skillsIssueData;

/**
 * Matches username to the user's skillsIssueNum from JSON
 * @param {Array} username          - Key reference to look up user's Skill Issue
 * @return {Array} skillsIssueNum   - Corres. Skills Issue for user
 */
function retrieveSkillsIssue(username) {

  // Retrieve Skills Issue directory if not read already
  if (skillsIssueData === undefined) {
    console.log(`Reading Skills Issue directory...`);
    const rawData = fs.readFileSync(filepath, 'utf8');
    skillsIssueData = JSON.parse(rawData);
  }

  let skillsIssueNum = '';

  if (!username in skillsIssueData) {
    throw new Error(`Failed to find username: '${username}'`);
  }
  skillsIssueNum = skillsIssueData[username];
  console.log(`Success! Found Skills Issue: '${username}': '${skillsIssueNum}'`);

  return skillsIssueNum;
}

module.exports = retrieveSkillsIssue;
