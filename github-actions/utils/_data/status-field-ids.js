/**
  * The purpose of this utility is to list the (non-changing) GraphQL ids of the 'Status' fields
  * for the Website Project so that functions will not need to run a GraphQL query when needed
  *                   SEE BELOW for GraphQL query used to generate this list
  *
  * @params {String} statusField  - Standardized name of status field (see lines 10-27)
  * @returns {String} statusId    - the field id of the selected status
  */

function statusFieldIds(statusField) {

  // const statusValues = new Map([
  //   ["Agendas", "864392c1"],
  //   ["Ice_Box", "2b49cbab"],
  //   ["Emergent_Requests", "d468e876"],    
  //   ["New_Issue_Approval", "83187325"],
  //   ["Prioritized_Backlog", "434304a8"],
  //   ["ERs_And_Epics", "c81aac49"],
  //   ["In_Progress", "9a878e9c"],
  //   // ["Questions_In_Review", "53b56f8d"],
  //   ["Questions_In_Review", "8889577c"],
  //   ["QA", "d013db69"],
  //   ["UAT", "8fa184b4"],
  //   ["QA_Senior_Review", "dcf54222"],
  //   ["Done", "f8ad2dcb"],
  //   ["Development_Team", "68334e89"],
  //   ["PR_Needs_Review", "e6140194"],
  //   ["PR_Pending_Approval", "b8ef8e27"],
  //   ["PR_Approved", "70e431d8"],
  //   ["Feature_Branch", "88d8c3d6"],
  //   ["IGNORE", "0728afac"],
  // ]);

  const statusValues = new Map([          // for TWG
    ["Agendas", "941e9965"],
    ["Ice_Box", "d039008d"],
    ["Emergent_Requests", "8749a929"],    
    ["New_Issue_Approval", "31082c42"],
    ["Prioritized_Backlog", "3d615590"],
    ["ERs_And_Epics", "387a9d00"],
    ["In_Progress", "4be08c01"],
    ["Questions_In_Review", "8889577c"],
    ["QA", "b58f4901"],
    ["UAT", "18b48c1f"],
    ["QA_Senior_Review", "4bf4d791"],
    ["Done", "199de7b8"],
    ["Development_Team", "79b0f439"],
    ["PR_Needs_Review",  "d3dec1c7"],
    ["PR_Pending_Approval", "a113bef6"],
    ["PR_Approved", "21e33c3c"],
    ["Feature_Branch", "024a83ed"],
    ["IGNORE", "d662f195"],
  ]);


  statusId = statusValues.get(statusField);

  return statusId;
}

/*
query findStatusSubfieldIds ($login: String!, $projNum: Int!, $fieldName: String!) {
  organization(login: $login) {
    projectV2(number: $projNum) {
      id
      field(name:$fieldName) { 
        ... on ProjectV2SingleSelectField { 	
        id options{ 
            id
            name
            ... on ProjectV2SingleSelectFieldOption {
              id
            }
          } 
        }
      }
    }
  }
}

{
  "login":"hackforla",
  "projNum": 86,
	"fieldName": "Status"
}
*/

module.exports = statusFieldIds;