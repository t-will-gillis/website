const fs = require('fs');

/*
 * Match label reference name(s) to the label display name(s) from the /_data/label_directory.json
 * @param {Array} keyNames       - List of reference names to look up display names
 * @return {Array} displayNames  - List of display names
 */
function labelRetrieveNames(keyNames) {

  // Retrieve label directory
  const filepath = 'github-actions/utils/_data/label-directory.json';
  const rawData = fs.readFileSync(filepath, 'utf8');
  const data = JSON.parse(rawData);

  const displayNames = [ ];
  for(let keyName of keyNames) {
    try {
      displayNames.push(data[keyName][1]);
      console.log(`Input ${keyName} with output ${data[keyName][1]}`);
    } catch (err) {
      console.error(`Failed to find label display name for label keyName ${keyName}`)
    }
  }

  return displayNames;
}

module.exports = labelRetrieveNames;
