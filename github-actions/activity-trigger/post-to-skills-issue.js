async function postToSkillsIssue({g, c}, activity) {

    github = g;
    context = c;

    console.log(activity[0]);
    console.log(activity[1]);

}

module.exports = postToSkillsIssue;