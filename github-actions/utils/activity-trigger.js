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
    console.log(`eventUrl = ${eventUrl}`);

    const actionMap = {
        'issues.opened': 'opened an issue',
        'issues.closed': 'closed an issue', 
        'issues.assigned': 'been assigned to an issue',
        'issues.unassigned': 'been unassigned from an issue',
        'issue_comment.created': 'commented on an issue',
        'pull_request.opened': 'opened a pull request',
        'pull_request.closed': 'closed a pull request',
        'pull_request_review.submitted': 'submitted a pull request review'
    };
    const action = actionMap[`${eventName}.${eventAction}`];
    let message = `@ ${eventActor} has ${action}: #[${issueNum}](eventUrl)`;
    return message;
}

module.exports = activityTrigger;