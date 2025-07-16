/**
 * This function is triggered by member activities, which include:
 * the eventName (i.e. "issues", "pull_request", "pull_request_review", etc. ), 
 * the eventAction (i.e. "opened", "assigned", "submitted", etc.), and
 * the eventActor (user who is credited for the event).
 * 
 */




async function activityTrigger({g, c}) {

    github = g;
    context = c;

    let issueNum = '';
    let assignee = '';

    let eventName = context.eventName;
    let eventAction = context.payload.action;
    let eventActor = context.actor;


    if (eventName.includes('issue')) {
        issueNum = context.payload.issue.number;
        eventUrl = context.payload.issue.html_url;

        // If issue action is not opened and an assignee exists, 
        // then change the eventActor to the issue assignee
        assignee = context.payload.assignee.login;
        if (eventAction != 'opened' && assignee != null ) {
            console.log(`Issue is ${eventAction}. Change eventActor => ${assignee}`);
            eventActor = assignee;
        }
        messageSnip = `has ${eventAction} an issue:`
    } else if (eventName == 'issue_comment') {
        issueNum = context.payload.issue.number;
        eventUrl = context.payload.comment.html_url;
        // eventActor = context.actor;
    } else if (eventName == 'pull_request') {
        issueNum = context.payload.pull_request.number;
        eventUrl = context.payload.pull_request.html_url;
        // eventActor = context.actor;
    } else if (eventName == 'pull_request_review') {
        issueNum = context.payload.pull_request.number;
        eventUrl = context.payload.review.html_url;
        // eventActor = context.actor;
    }

    console.log(`eventName = ${eventName}`);
    console.log(`eventAction = ${eventAction}`);
    console.log(`eventActor = ${eventActor}`);
    console.log(`issueNum = ${issueNum}`);

    let message = `#[${issueNum}](${eventUrl}) has been ${eventAction} by ${eventActor}`
    console.log(message);
}

/*
`Contributor Bob has opened an issue:` 
`Contributor Bob has been assigned to an issue:`
`Contributor Bob has been unassigned from an issue:`
`Contributor Bob has created an issue comment:`
`Contributor Bob has opened a pull request:` 
`Contributor Bob has submitted a pull request review for #xxxx:`
*/

module.exports = activityTrigger;