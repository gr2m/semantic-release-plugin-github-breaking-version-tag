# semantic-release-plugin-github-breaking-version-tag

> Create tags for breaking version ranges using GitHub's REST API, e.g. `v1`, `v2`, etc

This plugin was created for GitHub repositories that hold GitHub Actions. When using GitHub Actions from an external repository, the latest version from the default branch is used. An optional reference can be passed, such as a branch name, commit sha, or tag.

In order to use a GitHub Action and to automatically retrieve all updates, but no breaking changes, a pattern emerged to use breaking version tags, such as `v1`, `v2`, etc. which enable a usage such as

```yml
- uses: actions/checkout@v2
```

With this plugin, a breaking version tag is automatically created or updated each time a stable or maintenance version is released.

## Example configruation

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "semantic-release-plugin-github-breaking-version-tag",
    "@semantic-release/github"
  ]
}
```

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[ISC](LICENSE)
