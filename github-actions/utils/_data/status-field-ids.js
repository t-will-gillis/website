



function statusFieldIds(statusField) {

    const Agendas = "Agendas";
    const Ice_Box = "Ice box";
    const Emergent_Requests = "Emergent Requests";
    const New_Issue_Approval = "New Issue Approval";
    const Prioritized_Backlog = "Prioritized backlog";
    const ERs_And_Epics = "ERs and epics that are ready to be turned into issues";
    const In_Progress = "In progress (actively working)";
    const Questions_In_Review = "Questions / In Review";
    const QA = "QA";
    const UAT = "UAT";
    const QA_Senior_Review = "QA - senior review";
    const Done = "Done";
    const Development_Team = "Development team meeting discussion items 🤔";
    const PR_Needs_Review = "PR Needs review (Automated Column, do not place items here manually)";
    const PR_Pending_Approval = "test-pending-approval (Automated Column, do not place items here manually)"; 
    const PR_Approved = "test-approved-by-reviewer (Automated Column, do not place items here manually)";
    const Feature_Branch = "Feature Branch - don't merge into gh-pages branch yet";
    const IGNORE = "IGNORE: PRs closed without being merged";

  
  // const statusValues = new Map([          // for HFLA
  //     [Agendas, "864392c1"],
  //     [Ice_Box, "2b49cbab"],
  //     [Emergent_Requests, "d468e876"],    
  //     [New_Issue_Approval, "83187325"],
  //     [ERs_And_Epics, "c81aac49"],
  //     [Prioritized_Backlog, "434304a8"],
  //     [In_Progress, "9a878e9c"],
  //     [Questions_In_Review, "53b56f8d"],
  //     [QA, "d013db69"],
  //     [UAT, "8fa184b4"],
  //     [QA_Senior_Review, "dcf54222"],
  //     [Done, "f8ad2dcb"],
  //     [Development_Team, "68334e89"],
  //     [PR_Needs_Review, "e6140194"],
  //     [PR_Pending_Approval, "b8ef8e27"],
  //     [PR_Approved, "70e431d8"],
  //     [Feature_Branch, "88d8c3d6"],
  //     [IGNORE, "0728afac"],
  //   ]);

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
    console.log(`statusId: ${statusId}`):
    return statusId;
}

module.exports = statusFieldIds;
