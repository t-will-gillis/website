



async function activityTrigger({g, c}, eventName, eventAction, eventActor) {

    github = g;
    context = c;

    // const actEventS = JSON.stringify(actEvent, null, 2); 
    // const act_action = github.event.action; 
    // const act_activity = github.event_name;
    const actor = github.actor;
    const issueNum = context.payload.issue.number;
    // const issueContext = context.payload.issue;
    // const contextT = JSON.stringify(issueContext);

    console.log(`eventName = ${eventName}`);
    console.log(`eventAction = ${eventAction}`);
    console.log(`eventActor = ${eventActor}`);
    console.log(`actor = ${actor}`);
    console.log(`issueNum = ${issueNum}`);
    console.log('------------------------------');

    // console.log(`context = ${contextT}`);
}

module.exports = activityTrigger;