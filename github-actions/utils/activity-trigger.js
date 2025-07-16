



async function activityTrigger({g, c}, eventName, eventAction, eventActor, eventAssignee) {

    github = g;
    context = c;

    let issueNum = '';
    let assignee = '';
    
    let cEventName = context.eventName;
    let cEventAction = context.payload.action;
    let cEventActor = context.actor;


    if (eventName.includes('issue')) {
        issueNum = context.payload.issue.number;
        assignee = context.payload.assignee.login;
        console.log(`assignee = ${assignee}`);
        if (eventAction.includes('assigned')) {
            eventActor = assignee;
        }
    } else if (eventName.includes('pull_request')) {
        issueNum = context.payload.pull_request.number;
        console.log(`author = ${context.payload.pull_request.author}`)
    } else {
        issueNum = 'unknown'
    }

    console.log(`eventName = ${eventName}`);
    console.log(`cEventName = ${cEventName}`);
    console.log(`eventAction = ${eventAction}`);
    console.log(`cEventAction = ${cEventAction}`);
    console.log(`eventActor = ${eventActor}`);
    console.log(`cEventActor = ${cEventActor}`);
    console.log(`issueNum = ${issueNum}`);

}

module.exports = activityTrigger;