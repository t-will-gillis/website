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
    let timeline = '';

    let eventName = context.eventName;
    let eventAction = context.payload.action;
    let eventActor = context.actor;
    let activity = [];

    const excludedActors = ['HackforLABot', 'elizabethhonest'];

    if (eventName === 'issues') {
        issueNum = context.payload.issue.number;
        eventUrl = context.payload.issue.html_url;
        timeline = context.payload.issue.updated_at;
        // If issue action is not opened and an assignee exists, then 
        // change eventActor to the issue assignee, else to issue author
        assignee = context.payload.assignee?.login;
        if (eventAction != 'opened' && assignee != null ) {
            console.log(`Issue is ${eventAction}. Change eventActor => ${assignee}`);
            eventActor = assignee;
        } else {
            eventActor = context.payload.issue.user.login;
        }
        if (eventAction === 'closed') {
            let reason = context.payload.issue.state_reason;
            eventAction = reason;
        }
    } else if (eventName === 'issue_comment') {
        issueNum = context.payload.issue.number;
        eventUrl = context.payload.comment.html_url;
        timeline = context.payload.comment.updated_at;
    } else if (eventName === 'pull_request') {
        issueNum = context.payload.pull_request.number;
        eventUrl = context.payload.pull_request.html_url;
        timeline = context.payload.pull_request.updated_at;
        // If PR closed, change eventActor to the original author and check if merged
        if (eventAction === 'closed') {
            eventAction = context.payload.pull_request.merged ? 'merged' : 'closed';
            eventActor = context.payload.pull_request.user.login;
        }
    } else if (eventName === 'pull_request_review') {
        issueNum = context.payload.pull_request.number;
        eventUrl = context.payload.review.html_url;
        timeline = context.payload.review.updated_at;
    }

    console.log(`eventName = ${eventName}`);
    console.log(`eventAction = ${eventAction}`);
    console.log(`eventActor = ${eventActor}`);
    console.log(`issueNum = ${issueNum}`);
    console.log(`eventUrl = ${eventUrl}`);
    console.log(`eventTime = ${timeline}`);

    // Return immediately if the issueNum is a Skills Issue
    const isSkillsIssue = await checkIfSkillsIssue(issueNum);
    if (isSkillsIssue) {
        console.log(`issueNum: ${issueNum} identified as Skills Issue`);
        return activity;
    }
    // Return immediately if the eventActor is a bot
    if (eventActor in excludedActors) {
        return activity;
    }

    const actionMap = {
        'issues.opened': 'opened an issue',
        'issues.completed': 'closed an issue as completed',
        'issues.not_planned': 'closed an issue as not planned',
        'issues.duplicate': 'closed an issue as duplicate',
        'issues.assigned': 'been assigned to an issue',
        'issues.unassigned': 'been unassigned from an issue',
        'issue_comment.created': 'commented on an issue or pr',
        'pull_request.opened': 'opened a pull request',
        'pull_request.closed': 'had a pull request closed w/o merging',
        'pull_request.merged': 'had a pull request merged',
        'pull_request_review.submitted': 'submitted a pull request review'
    };
    const action = actionMap[`${eventName}.${eventAction}`];
    let message = `@ ${eventActor} has ${action}: #[${issueNum}](${eventUrl}) at ${timeline}`;
    console.log(message);

    activity = [eventActor, message];
    return activity;


    /**
     * Helper function to check if issueNum references a Skills Issue
     * @param {Number} issueNum   - issue number to check 
     * @returns {Boolean}         - true if Skills Issue, false if not
     */
    async function checkIfSkillsIssue(issueNum) {
        // https://docs.github.com/en/rest/issues/labels?apiVersion=2022-11-28#list-labels-for-an-issue
        const labelData = await github.request('GET /repos/{owner}/{repo}/issues/{issue_number}/labels', {
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issueNum
        });
        const isSkillsIssue = labelData.data.some(label => label.name === "Complexity: Prework");

        return isSkillsIssue;
    }
}

module.exports = activityTrigger;