const fs = require('fs');

/*
 * Match label reference name(s) to the label display name(s) from the /_data/label_directory.json
 * @param {Array} keyNames       - List of reference names to look up display names
 * @return {Array} displayNames  - List of display names
 */
function labelRetrieveName(...keyNames) {

  console.log(keyNames);
  // Retrieve label directory
  const filepath = 'github-actions/utils/_data/label-directory.json';
  const rawData = fs.readFileSync(filepath, 'utf8');
  const data = JSON.parse(rawData);

  const displayNames = keyNames.map(keyName => data[keyName][1]);
  console.log('in retrieve');
  console.log(displayNames);
  return displayNames;
}

module.exports = labelRetrieveName;
