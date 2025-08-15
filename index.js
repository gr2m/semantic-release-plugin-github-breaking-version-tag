import { Octokit } from "@octokit/core";

import parseGithubUrl from "./parse-github-url.js";

export async function success(
  _pluginConfig,
  { env, nextRelease, options: { repositoryUrl }, logger },
) {
  const isPreMajor = nextRelease.type === "premajor";
  const isMajor = nextRelease.type === "major";

  if (!isPreMajor && !isMajor) {
    logger.info("next release is not a major version, skipping tag creation");
    return;
  }

  const octokit = new Octokit({
    auth: env.GH_TOKEN || env.GITHUB_TOKEN,
  });
  const { owner, repo } = parseGithubUrl(repositoryUrl);

  const [breakingVersion] = nextRelease.version.split(".");
  let breakingVersionTag = `v${breakingVersion}`;
  const sha = nextRelease.gitHead;

  if (isPreMajor) {
    breakingVersionTag += `-${nextRelease.channel}`;
  }

  try {
    // https://docs.github.com/en/rest/reference/git#get-a-reference
    const exists = await octokit.request(
      "GET /repos/{owner}/{repo}/git/ref/{ref}",
      {
        owner,
        repo,
        ref: `tags/${breakingVersionTag}`,
      },
    );

    logger.info(`tag ${breakingVersionTag} already exists`);

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

    logger.info(`tag ${breakingVersionTag} does not exist yet`);

    // https://docs.github.com/en/rest/reference/git#create-a-reference
    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo,
      sha,
      ref: `refs/tags/${breakingVersionTag}`,
    });
  }
}
