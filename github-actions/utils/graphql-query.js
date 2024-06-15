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

  const response = await fetch(
    'https://api.github.com/graphql',
    {
      method: 'POST',
      body: QUERY,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + GH_TOKEN,
      },
    }
  )
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
  
  return response;
  
}

module.exports = graphQlQuery;
