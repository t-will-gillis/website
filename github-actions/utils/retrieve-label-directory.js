const fs = require('fs');

// Global variables
var filepath = 'github-actions/utils/_data/label-directory.json';

/*
 * Matches label reference name(s) to the label display name(s) from JSON
 * @param {string } filepath     - Path to `label_directory.json`
 * @param {Array} labelKeys       - List of reference names to look up display names
 * @return {Array} displayNames  - List of display names
 */
function labelRetrieveNames(...labelKeys) {

  // Retrieve label directory
  const rawData = fs.readFileSync(filepath, 'utf8');
  const labelData = JSON.parse(rawData);

  const labelId = labelKeys[0];
  console.log(labelId)
  const labelName = labelData[labelId];
  console.log(labelName);
  try {
    displayNames = labelData[labelKeys[0]];
    console.log(displayNames)
    console.log(`Success! Found labelKey: '${labelKeys[0]}', returning labelName: '${labelData[labelKeys[0]]}'`);
  } catch (err) {
    console.error(`Failed to find labelKey: '${labelKeys[0]}'`)
  }


  return displayNames;

}

module.exports = labelRetrieveNames;




// const fs = require('fs');

// // Global variables
// var filepath = 'github-actions/utils/_data/label-directory.json';
// var labelData;
// /*
//  * Matches label reference name(s) to the label display name(s) from JSON
//  * @param {string } filepath     - Path to `label_directory.json`
//  * @param {Array} labelKeys       - List of reference names to look up display names
//  * @return {Array} displayNames  - List of display names
//  */
// function labelRetrieveNames(...labelKeys) {

//   // Retrieve label directory
//   if (labelData === undefined) {
//     console.log(`creating Label Data`);
//     const rawData = fs.readFileSync(filepath, 'utf8');
//     labelData = JSON.parse(rawData);
//   } else {
//     console.log(`data exists`);
//   }
 
//   let displayNames = '';
//   for(let labelKey of labelKeys) {
//     console.log(labelKey);
//     try {
//       displayNames.push(labelData[labelKey][0]);
//       console.log(`Success! Found labelKey: '${labelKey}', returning labelName: '${labelData[labelKey][0]}'`);
//     } catch (err) {
//       console.error(`Failed to find labelKey: '${labelKey}'`)
//     }
//   }
// /*
//   console.log(labelKeys);
//   let displayNames = '';
//   for(let labelKey of labelKeys) {
//     console.log(labelKey);
//     try {
//       displayNames.push(labelData[labelKeys][0]);
//       console.log(`Success! Found labelKey: '${labelKey}', returning labelName: '${labelData[labelKeys][0]}'`);
//     } catch (err) {
//       console.error(`Failed to find labelKey: '${labelKey}'`)
//     }
//   }
//   */
//   return displayNames;
// }


// module.exports = labelRetrieveNames;
