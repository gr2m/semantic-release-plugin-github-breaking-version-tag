// Source: https://github.com/semantic-release/github/blob/c110f7a32f458fd1fcb5000b15134c4c662cf8f3/lib/parse-github-url.js
/* c8 ignore start */
module.exports = (repositoryUrl) => {
  const [match, auth, host, path] =
    /^(?!.+:\/\/)(?:(?<auth>.*)@)?(?<host>.*?):(?<path>.*)$/.exec(
      repositoryUrl
    ) || [];
  try {
    const [, owner, repo] =
      /^\/(?<owner>[^/]+)?\/?(?<repo>.+?)(?:\.git)?$/.exec(
        new URL(
          match
            ? `ssh://${auth ? `${auth}@` : ""}${host}/${path}`
            : repositoryUrl
        ).pathname
      );
    return { owner, repo };
  } catch {
    return {};
  }
};
