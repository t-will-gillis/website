/**
 * Minimize issue comment given the comment's node Id
 * @param {String} nodeId         -  GraphQL node Id for the comment
 * 
 * 
 */
async function minimizeIssueComment(github, context, nodeId) {

  const mutation = `mutation($reason: String!, $nodeId: ID!) {
    minimizeComment(input: {
      classifier: $reason, 
      subjectId: $nodeid
    }) {
      clientMutationId
      minimizedComment {
        isMinimized
        minimizedReason
      }
    }
  }`;

  const variables = {
    reason: 'OUTDATED',
    nodeId: nodeId
  };

  try {
    await github.graphql(mutation, variables);
  } catch(error) {
    throw new Error(`Error in minimizeIssueComment() function: ${error}`);
  } 
}

module.exports = minimizeIssueComment;
