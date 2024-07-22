/**
 * Changes the "Status" of an issue (with the corresponding itemId) to a newStatusValue
 * @param {String} itemId          -  GraphQL item Id for the issue 
 * @param {String} newStatusValue  -  GraphQL Id value of the 'Status' field that the issue is moving to
 * 
 */
async function mutateIssueStatus(github, context, itemId, newStatusValue) {
  
  // Defaults for HfLA Website
  // const WEBSITE_PROJECT_ID = "PVT_kwDOALGKNs4Ajuck";
  // const STATUS_FIELD_ID = "PVTSSF_lADOALGKNs4AjuckzgcCutQ";
  const WEBSITE_PROJECT_ID = "PVT_kwHOAm6MB84Aiu3X";                        // for TWG
  const STATUS_FIELD_ID = "PVTSSF_lAHOAm6MB84Aiu3XzgbNC9E";

  const mutation = `mutation($projectId: ID!, $fieldId: ID!, $itemId: ID!, $value: String!) {
    updateProjectV2ItemFieldValue(input: {
      projectId: $projectId,
      fieldId: $fieldId,
      itemId: $itemId,
      value: {
        singleSelectOptionId: $value
      }
    }) {
      projectV2Item {
        id
      }
    }
  }`;

  const variables = {
    projectId: WEBSITE_PROJECT_ID,
    fieldId: STATUS_FIELD_ID,
    itemId: itemId,
    value: newStatusValue
  };
  
  try {
    await github.graphql(mutation, variables);
    console.log(`Successfully changed issue status`);
  } catch(error) {
    throw new Error("Error in mutateItemStatus() function: " + error);
  } 
}

module.exports = mutateIssueStatus;
