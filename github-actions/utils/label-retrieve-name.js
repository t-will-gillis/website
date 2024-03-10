const fs = require('fs');

/*
 * Match label reference name(s) to the label display name(s) from the /_data/label_directory.json
 * @param {String} keyName       - Reference name to look up display name
 * @return {String} displayName  - Display name
 */
async function labelRetrieveName(keyName) {

  // Retrieve label directory
  const filepath = 'github-actions/utils/_data/label-directory.json';
  const rawData = fs.readFileSync(filepath, 'utf8');
  const data = JSON.parse(rawData);

  const displayName = data[keyName][1]);
  return displayName;
}

module.exports = labelRetrieveName;
