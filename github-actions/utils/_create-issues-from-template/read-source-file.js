// import modules
const fs = require('fs');
const readline = require('readline');


/**
 * Parses a GitHub markdown/ schema issue template
 *
 * @param {string} filepath - filepath for source file
 * @return {array} issueObject - parameters to create issue
 */
function readSourceFile(filepath) {

  const filepath = './HfLA-Website_ spelling audit - Results.csv';
  // Read .csv file line by line
  const input = fs.createReadStream(filepath);
  const rl = readline.createInterface({input});

  rl.on('line', (row) => {
    // Process each line to extract variables
    row = row.split(',');
    // Flag which lines in .csv file to process 
    const regex = /words|ignoreWords/;
    if (regex.test(row[3])) {
      let textToInsert = row[1].split(':')[0].replaceAll('"','');
      let listToAppend = row[4];
      let fileName = row[0];
      let payload = {textToInsert, listToAppend, fileName};
    }
    
  });
    
  rl.on('close', () => {
      console.log('File reading completed.');
  });
}

module.exports = readSourceFile;
