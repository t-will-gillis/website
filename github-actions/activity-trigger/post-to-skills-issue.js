async function postToSkillsIssue({g, c}, activity) {

    github = g;
    context = c;

    const username = activity[0];
    const message = activity[1];

    // to do: if `username` == bot account (yes) or nonwebsite (maybe) END workflow
    // to do: Make library of Skills/Prework issues (to avoid constant lookups)
    // to do: Add function to consult library to find Skills number, END if doesn't exist
    // to do:    then add message to Skills Issue
    // to d0: If active member, open Skills- move to 'In progress'. else close Skills 
    // to do: check whether bot can edit an existing message... 

}

module.exports = postToSkillsIssue;