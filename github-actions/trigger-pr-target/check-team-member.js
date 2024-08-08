const isMemberOfTeam = require('../utils/check-team-membership');

async function main({github,context}) {
    const prAuthor = context.payload.sender.login;
    const prNumber = context.payload.number;
    const isMember = await isMemberOfTeam(github, prAuthor, 'website-write');
    console.log(isMember);
