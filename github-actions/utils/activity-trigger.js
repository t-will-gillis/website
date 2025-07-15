



async function activityTrigger(github, context) {

    // const act_event = github.event; 
    // const act_action = github.event.action; 
    // const issueNum = context.payload.issue.number;
    const issueContext = context.payload.issue;

    // console.log(`act_event = ${act_event}`);
    // console.log(`act_action = ${act_action}`);
    console.log(`issueContext = ${issueContext}`);
    console.log('------------------------------');
    console.log(`context = ${github.context}`);
}

module.exports = activityTrigger;