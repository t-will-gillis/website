// Ref: https://developer.ibm.com/articles/awb-consuming-graphql-apis-from-plain-javascript/

// Import modules
const fetch = require('node-fetch');

/*
 * Function that makes a GraphQL *query* to the GitHub API
 * @param{ Object } query         - body of the data query, pre-formed prior to funct. call       
 * @param{ String } token         - GitHub token
 * @param( String } message       - optional user agent message
 *
 */


function graphQlQuery(query, token) {                 

  
  const QUERY = query;
  const GH_TOKEN = token;
  const USER_AGENT_MESSAGE = message;

  const response = await fetch(
    'https://api.github.com/graphql',
    {
      method: 'POST',
      body: DATA,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + GH_TOKEN,
      },
    }
  )
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
  
  const json = await response.json();
  return json;

  
}
                       
  

 /* 
  const req = https.request(options, (res) => {
    let data = '';
    // console.log(`statusCode: ${res}`);
  
    res.on('data', (d) => {
      data += d;
    });
    res.on('end', () => {
      console.log(`GraphQL output: ${data}`);
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(mutation);
  req.end();
}
*/

module.exports = graphQlQuery;
