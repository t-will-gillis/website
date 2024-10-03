const fs = require('fs');

// Global variables
var filepath = 'github-actions/utils/_data/label-directory.json';

/*
 * Matches label reference name(s) to the label display name(s) from JSON
 * @param {string } filepath     - Path to `label_directory.json`
 * @param {Array} labelKeys       - List of reference names to look up display names
 * @return {Array} displayNames  - List of display names
 */
function labelRetrieveNames(labelKey) {

  // Retrieve label directory
  const rawData = fs.readFileSync(filepath, 'utf8');
  const data = JSON.parse(rawData);

  const displayName = '';
  try {
    displayName = (data[labelKey]);
    console.log(`Success! From label key: '${labelKey}' found label display: '${data[labelKey]}'`);
  } catch (err) {
    console.error(`Failed to find label display for label key: '${labelKey}'`)
  }

  return displayName;
}

module.exports = labelRetrieveNames;
