---
name: Review Inactive Team Members
about: Issue template used only by `schedule-monthly.yml`
title: "Review Inactive Team Members"
labels: "Feature: Administrative, Feature: Onboarding/Contributing.md, role: dev leads, Complexity: Small, Size: 0.5pt"
assignees: ''
---
# DRAFT
# Review of Inactive Website Team Members
## Inactive Members
Developers: If your name is on the following list, our team bot has determined that you have not been active with the Website team in the last 30 days. If we don't hear back from you in the upcoming weeks, we will unassign you from any issues you may be working on and remove you from the 'website-write' team.  

{notifiedList}  

### Did we make a mistake?
The bot is checking for the following activity:
- If you are assigned to an issue, that you have provided an update on the issue in the past 30 days.  The updates are due weekly.
- If your issue is a `Draft` in the "New Issue Approval" column, that you have added to it within the last 30 days.
- If you are reviewing PRs, that you have done some kind of activity in the past 30 days.

If you have been inactive in the last 30 days (using the above measurements), you can become active again by doing at least one of the above actions.

If you were active during the last 30 days (using the above measurements) and the bot made a mistake, let us know by responding in a comment (reopening this issue) with this message:
```
I am responding to Issue #{this issue}.
The Hack for LA website bot made a mistake, I have been active!  
See my Issue # or PR #  review
```
After you leave the comment, please send us a Slack message on the "hfla-site" channel with a link to your comment.


### Temporary leave
If you have taken a temporary leave, and you have been authorized to keep your assignment to an issue:  
- Your issue should be in the "Questions/ In Review" column, with the `Ready for dev lead` label and a note letting us know when you will be back.
- We generally try to encourage you to unassign yourself from the issue and allow us to return it to the prioritized backlog.  However, exceptions are sometimes made.

## Removed Members
Our team bot has determined that the following member(s) have not been active with the Website team for over 60 days, and therefore the member(s) have been removed from the 'website-write' team.

{removedList}

If this is a mistake or if you would like to return to the Hack for LA Website team, please respond in a comment with this message:
```
I am responding to Issue #{this issue}.
I want to come back to the team!
Please add me back to the write team, I am ready to work on an issue now.
```
After you leave the comment, please send us a Slack message on the "hfla-site" channel with a link to your comment.
