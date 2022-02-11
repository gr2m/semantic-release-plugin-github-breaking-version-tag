module.exports = {
  success,
};

const { Octokit } = require("@octokit/core");
const debug = require("debug")(
  "semantic-release:semantic-release-plugin-github-breaking-version-tag"
);

const parseGithubUrl = require("./parse-github-url.js");

async function success(
  _pluginConfig,
  { env, nextRelease, options: { repositoryUrl } }
) {
  const octokit = new Octokit({
    auth: env.GH_TOKEN || env.GITHUB_TOKEN,
  });
  const { owner, repo } = parseGithubUrl(repositoryUrl);

  const [breakingVersion] = nextRelease.version.split(".");
  const breakingVersionTag = `v${breakingVersion}`;
  const sha = nextRelease.gitHead;

  let exists;
  try {
    // https://docs.github.com/en/rest/reference/git#get-a-reference
    exists = await octokit.request("GET /repos/{owner}/{repo}/git/ref/{ref}", {
      owner,
      repo,
      ref: `tags/${breakingVersionTag}`,
    });

    debug(`tag ${breakingVersionTag} already exists`);

    // https://docs.github.com/en/rest/reference/git#update-a-reference
    await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
      owner,
      repo,
      ref: `tags/${breakingVersionTag}`,
      sha,
      force: true,
    });
  } catch (error) {
    /* c8 ignore next */
    if (error.status !== 404) throw error;

    debug(`tag ${breakingVersionTag} does not exist yet`);

    // https://docs.github.com/en/rest/reference/git#create-a-reference
    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo,
      sha,
      ref: `refs/tags/${breakingVersionTag}`,
    });
  }
}
