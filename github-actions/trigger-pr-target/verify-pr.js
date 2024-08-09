// fffff

async function main({ github, context }, { prNumber, result }) {

  if (result == 'true') {
    return;
  }
  
  const commentContent =
    "You must be a member of the HFLA website team in order to create pull requests. Please see our page \
      on how to join us as a member at HFLA: https://www.hackforla.org/getting-started. If you have been \
      though onboarding and feel this message was sent in error, please message us in the #hfla-site team \
      Slack channel with the link to this PR.";
  console.log(`current owner: ${context.repo.owner}`);
  try {
    await github.rest.pulls.update({
      owner: context.repo.owner,
      repo: context.payload.repo,
      pull_number: prNumber,
      state: "closed",
    });
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.payload.repo,
      issue_number: prNumber,
      body: commentContent,
    });
  } catch (closeCommentError) {
      throw closeCommentError;
  }
}

module.exports = main;
