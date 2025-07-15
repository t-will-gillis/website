



async function activityTrigger({g, c}, eventName, eventAction, eventActor) {

    github = g;
    context = c;

    const issueNum = context.payload.issue.number;

    console.log(`eventName = ${eventName}`);
    console.log(`eventAction = ${eventAction}`);
    console.log(`eventActor = ${eventActor}`);
    console.log(`issueNum = ${issueNum}`);
}

module.exports = activityTrigger;