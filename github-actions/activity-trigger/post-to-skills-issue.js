async function postToSkillsIssue({g, c}, activity) {

    github = g;
    context = c;

    console.log(activity['eventActor']);
    console.log(activity['message']);

}

module.exports = postToSkillsIssue;