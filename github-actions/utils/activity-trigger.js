



async function activityTrigger({github, context}, actEvent, actAction) {

    // const act_event = github.event; 
    // const act_action = github.event.action; 
    // const issueNum = context.payload.issue.number;
    // const issueContext = context.payload.issue;

    console.log(`actEvent = ${actEvent}`);
    console.log(`actAction = ${actAction}`);
    // console.log(`issueNum = ${issueNum}`);
    console.log('------------------------------');
    console.log(`context = ${github.context}`);
}

module.exports = activityTrigger;