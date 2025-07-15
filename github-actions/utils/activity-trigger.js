



async function activityTrigger({g, c}, eventName, eventAction, eventActor) {

    github = g;
    context = c;
    let issueNum = '';

    if (eventName.includes('issue')) {
        issueNum = context.payload.issue.number;
    } else if (eventName.includes('pull_request')) {
        issueNum = context.payload.pull_request.number;
    } else {
        issueNum = 'unknown'
    }

    console.log(`eventName = ${eventName}`);
    console.log(`eventAction = ${eventAction}`);
    console.log(`eventActor = ${eventActor}`);
    console.log(`issueNum = ${issueNum}`);
}

module.exports = activityTrigger;