


async function graphQLquery(githubToken, userAgentMessage) {
  const mutation = JSON.stringify({
    query: `mutation HideOutdatedComment($nodeid: ID!){ 
        minimizeComment(input:{
          classifier:OUTDATED,
          subjectId: $nodeid
        }) {
          clientMutationId
          minimizedComment {
            isMinimized
            minimizedReason
          }
        }
      }`,
    variables: {
      nodeid: node_id
    }
  });

  const options = {
    hostname: 'api.github.com',
    path: '/graphql',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + githubToken,
      'user-agent': userAgentMessage
    }
  };

  // copied from https://developer.ibm.com/articles/awb-consuming-graphql-apis-from-plain-javascript/
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
