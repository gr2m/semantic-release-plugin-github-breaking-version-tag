import test from "ava";
import nock from "nock";

import { success } from "./index.js";

test("create new v1 tag", async (t) => {
  const mock = nock("https://api.github.com")
    // tag does not yet exist
    .get(
      "/repos/gr2m/semantic-release-plugin-github-breaking-version-tag/git/ref/tags%2Fv1",
    )
    .reply(404)
    // create tag
    .post(
      "/repos/gr2m/semantic-release-plugin-github-breaking-version-tag/git/refs",
      (body) => {
        t.deepEqual(body, { ref: "refs/tags/v1", sha: "sha123" });

        return true;
      },
    )
    .reply(201);

  const logs = [];
  await success(
    {},
    {
      env: {
        GITHUB_TOKEN: "token",
      },
      nextRelease: { type: "major", version: "1.2.3", gitHead: "sha123" },
      options: {
        repositoryUrl:
          "https://github.com/gr2m/semantic-release-plugin-github-breaking-version-tag",
      },
      logger: {
        info() {
          logs.push(...arguments);
        },
      },
    },
  );

  t.deepEqual(mock.pendingMocks(), []);
  t.deepEqual(logs, ["tag v1 does not exist yet"]);
});

test("update existing v1 new tag", async (t) => {
  const mock = nock("https://api.github.com")
    // tag does not yet exist
    .get(
      "/repos/gr2m/semantic-release-plugin-github-breaking-version-tag/git/ref/tags%2Fv1",
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
      },
    )
    .reply(200);

  const logs = [];
  await success(
    {},
    {
      env: {
        GITHUB_TOKEN: "token",
      },
      nextRelease: { type: "major", version: "1.2.3", gitHead: "sha123" },
      options: {
        repositoryUrl:
          "https://github.com/gr2m/semantic-release-plugin-github-breaking-version-tag",
      },
      logger: {
        info() {
          logs.push(...arguments);
        },
      },
    },
  );

  t.deepEqual(mock.pendingMocks(), []);
  t.deepEqual(logs, ["tag v1 already exists"]);
});

test("create new v2-beta tag", async (t) => {
  const mock = nock("https://api.github.com")
    // tag does not yet exist
    .get(
      "/repos/gr2m/semantic-release-plugin-github-breaking-version-tag/git/ref/tags%2Fv2-beta",
    )
    .reply(404)
    // create tag
    .post(
      "/repos/gr2m/semantic-release-plugin-github-breaking-version-tag/git/refs",
      (body) => {
        t.deepEqual(body, { ref: "refs/tags/v2-beta", sha: "sha123" });
        return true;
      },
    )
    .reply(201);

  const logs = [];
  await success(
    {},
    {
      env: {
        GITHUB_TOKEN: "token",
      },
      nextRelease: {
        type: "premajor",
        version: "2.0.0-beta.1",
        gitHead: "sha123",
        channel: "beta",
      },
      options: {
        repositoryUrl:
          "https://github.com/gr2m/semantic-release-plugin-github-breaking-version-tag",
      },
      logger: {
        info() {
          logs.push(...arguments);
        },
      },
    },
  );

  t.deepEqual(mock.pendingMocks(), []);
  t.deepEqual(logs, ["tag v2-beta does not exist yet"]);
});
