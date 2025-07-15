



async function activityTrigger({g, c}, actEvent, actAction) {

    github = g;
    context = c;

    const actEventS = JSON.stringify(actEvent, null, 2); 
    // const act_action = github.event.action; 
    // const issueNum = context.payload.issue.number;
    // const issueContext = context.payload.issue;

    console.log(`actEvent = ${actEventS}`);
    console.log(`actAction = ${actAction}`);
    // console.log(`issueNum = ${issueNum}`);
    console.log('------------------------------');

    console.log(`context = ${context.payload.issue}`);
}

module.exports = activityTrigger;