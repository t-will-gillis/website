const fs = require('fs');

// Global variables
var filepath = 'github-actions/utils/_data/label-directory.json';
var labelData;
/*
 * Matches label reference name(s) to the label display name(s) from JSON
 * @param {string } filepath     - Path to `label_directory.json`
 * @param {Array} labelKeys       - List of reference names to look up display names
 * @return {Array} displayNames  - List of display names
 */
function labelRetrieveNames(...labelKeys) {
  console.log(labelData);
  // Retrieve label directory
  if (labelData === undefined) {
    console.log(`no data yet! gonna run now`);
    const rawData = fs.readFileSync(filepath, 'utf8');
    labelData = JSON.parse(rawData);
  } else {
    console.log(`data exists already`);
  }
  

  const displayNames = [ ];
  for(let labelKey of labelKeys) {
    console.log(labelKey);
    try {
      displayNames.push(data[labelKey][0]);
      console.log(`Success! Found labelKey: '${labelKey}', returning labelName: '${data[labelKey][0]}'`);
    } catch (err) {
      console.error(`Failed to find labelKey: '${labelKey}'`)
    }
  }

  return displayNames;
}


module.exports = labelRetrieveNames;
