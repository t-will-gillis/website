



async function activityTrigger({g, c}, eventName, eventAction, eventActor) {

    github = g;
    context = c;

    let issueNum = '';
    let assignee = '';
    
    console.log(`eventName = ${eventName}`);
    console.log(`eventAction = ${eventAction}`);
    console.log(`eventActor = ${eventActor}`);
    console.log(`issueNum = ${issueNum}`);

    if (eventName.includes('issue')) {
        issueNum = context.payload.issue.number;
        assignee = context.payload.issue.assignee;
        console.log(context.payload.issue.assignee);
        if (eventAction.includes('assigned')) {
            eventActor = assignee;
        }
    } else if (eventName.includes('pull_request')) {
        issueNum = context.payload.pull_request.number;
        console.log(`author = ${context.payload.pull_request.author}`)
    } else {
        issueNum = 'unknown'
    }


}

module.exports = activityTrigger;