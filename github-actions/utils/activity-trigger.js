



async function activityTrigger(github, context) {

    const act_event = github.event; 
    const act_action = github.event.action; 
    const issueNum = context.payload.issue.number;


    console.log(`act_event = ${act_event}`);
    console.log(`act_action = ${act_action}`);
    console.log(`issueNum = ${issueNum}`);
    console.log('------------------------------');
    console.log(`context = ${context}`);
}

module.exports = activityTrigger;