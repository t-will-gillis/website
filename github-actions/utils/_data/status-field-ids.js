



function statusFieldIds(statusField) {

  // const statusValues = new Map([
  //   [Emergent_Requests, "d468e876"],
  //   [New_Issue_Approval, "83187325"],
  //   [Prioritized_Backlog, "434304a8"],
  //   [In_Progress, "9a878e9c"],
  // ]);
  
    const statusValues = new Map([          // for TWG
      [Agendas, "941e9965"],
      [Ice_Box, "d039008d"],
      [Emergent_Requests, "8749a929"],    
      [New_Issue_Approval, "31082c42"],
      [Prioritized_Backlog, "3d615590"],
      [Ers_Epics_Ready, "387a9d00"],
      [In_Progress, "4be08c01"],
      [Questions_Review, "8889577c"],
      [QA, "b58f4901"],
      [UAT, "18b48c1f"],
      [QA_Senior_Rvw, "4bf4d791"],
      [Done, "199de7b8"],
      [Development_Team, "79b0f439"],
      [PR_Needs_Review,  "d3dec1c7"],
      [PR_Pending_Approval, "a113bef6"],
      [PR_Approved, "21e33c3c"],
      [IGNORE, "d662f195"],
    ]);

    statusId = statusValues.get(statusField);
    return statusId;
}

module.exports = statusFieldIds;
