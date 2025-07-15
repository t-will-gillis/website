



async function activityTrigger({g, c}) {

    github = g;
    context = c;

    // const actEventS = JSON.stringify(actEvent, null, 2); 
    const act_action = github.event.action; 
    const act_activity = github.event_name;
    const actor = github.actor;
    const issueNum = context.payload.issue.number;
    // const issueContext = context.payload.issue;
    // const contextT = JSON.stringify(issueContext);

    console.log(`actEvent = ${act_action}`);
    console.log(`actAction = ${act_activity}`);
    console.log(`actor = ${actor}`);
    console.log(`issueNum = ${issueNum}`);
    console.log('------------------------------');

    // console.log(`context = ${contextT}`);
}

module.exports = activityTrigger;