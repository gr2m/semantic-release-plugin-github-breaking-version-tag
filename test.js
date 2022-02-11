const test = require("ava");
const nock = require("nock");

const { success } = require("./index.js");

test("create new v1 tag", async (t) => {
  const mock = nock("https://api.github.com")
    // tag does not yet exist
    .get(
      "/repos/gr2m/semantic-release-plugin-github-breaking-version-tag/git/ref/tags%2Fv1"
    )
    .reply(404)
    // create tag
    .post(
      "/repos/gr2m/semantic-release-plugin-github-breaking-version-tag/git/refs",
      (body) => {
        t.deepEqual(body, { ref: "refs/tags/v1", sha: "sha123" });

        return true;
      }
    )
    .reply(201);

  await success(
    {},
    {
      env: {
        GITHUB_TOKEN: "token",
      },
      nextRelease: { version: "1.2.3", gitHead: "sha123" },
      options: {
        repositoryUrl:
          "https://github.com/gr2m/semantic-release-plugin-github-breaking-version-tag",
      },
    }
  );

  t.deepEqual(mock.pendingMocks(), []);
});

test("update existing v1 new tag", async (t) => {
  const mock = nock("https://api.github.com")
    // tag does not yet exist
    .get(
      "/repos/gr2m/semantic-release-plugin-github-breaking-version-tag/git/ref/tags%2Fv1"
    )
    .reply(200, {
      object: {
        sha: "abcdef",
      },
    })
    // update tag
    .patch(
      "/repos/gr2m/semantic-release-plugin-github-breaking-version-tag/git/refs/tags%2Fv1",
      (body) => {
        t.deepEqual(body, { sha: "sha123", force: true });
        return true;
      }
    )
    .reply(200);

  await success(
    {},
    {
      env: {
        GITHUB_TOKEN: "token",
      },
      nextRelease: { version: "1.2.3", gitHead: "sha123" },
      options: {
        repositoryUrl:
          "https://github.com/gr2m/semantic-release-plugin-github-breaking-version-tag",
      },
    }
  );

  t.deepEqual(mock.pendingMocks(), []);
});
