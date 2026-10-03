# Contributing

Thanks for taking the time to contribute! Bug reports, ideas and pull requests are all welcome.

By participating in this project you agree to follow its [Code of Conduct](./CODE_OF_CONDUCT.md).

## Reporting bugs and suggesting features

Open an [issue](https://github.com/Okamidev/markdown-it-sfc-tabs-snippet/issues/new/choose) using
one of the templates. For a bug, a minimal `.vue` file and the markdown line that imports it are
the most useful things to include.

Security problems should **not** be reported in a public issue — see [SECURITY.md](./SECURITY.md).

## Development setup

You need Node 20 or newer (22.18+ or 24+ to run the playground, which runs TypeScript directly).

```sh
git clone https://github.com/Okamidev/markdown-it-sfc-tabs-snippet.git
cd markdown-it-sfc-tabs-snippet
npm install
```

| Command                | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm test`             | Run the tests in watch mode (vitest)                      |
| `npm run test:run`     | Run the tests once                                        |
| `npm run typecheck`    | Type-check `src` and `test`                               |
| `npm run lint`         | Lint with oxlint (warnings fail)                          |
| `npm run lint:fix`     | Fix what oxlint can fix automatically                     |
| `npm run format`       | Format the code with oxfmt                                |
| `npm run format:check` | Check formatting without writing                          |
| `npm run build`        | Emit `dist/` with type declarations                       |
| `npm run playground`   | Render `playground/page.md` and print the tokens and HTML |

The code is formatted with 4-space indentation; run `npm run format` rather than formatting by
hand.

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Make your change, with tests in `test/` for any behavior change or bug fix.
3. Make sure everything passes locally:
   ```sh
   npm run format:check && npm run lint && npm run typecheck && npm run test:run
   ```
4. Update the [README](./README.md) if you change the syntax, options or output.
5. Open the pull request and fill in the template.

CI runs the same checks on Node 20, 22 and 24, and runs the tests against the lowest supported
versions of `markdown-it` and `vue`.

## Commit messages

This project follows [Conventional Commits](https://www.conventionalcommits.org). Releases, version
numbers and the changelog are generated from commit messages by
[release-please](https://github.com/googleapis/release-please), so the type matters:

| Type                                               | Effect                                         |
| -------------------------------------------------- | ---------------------------------------------- |
| `fix: …`                                           | Patch release, listed in the changelog         |
| `feat: …`                                          | Minor release, listed in the changelog         |
| `feat!: …` or a `BREAKING CHANGE:` footer          | Major release (minor while the version is 0.x) |
| `docs`, `test`, `refactor`, `ci`, `chore`, `build` | No release on their own                        |

Examples:

```text
fix: keep tabs order when a style block precedes the template
feat: support a custom title for each tab
docs: document the containerName option
```

When a pull request is squash-merged, its title becomes the commit message, so please write the
title in the same format.

## Releases

Releases are handled by the maintainer: merging the release pull request opened by release-please
tags the version and publishes it to npm from GitHub Actions.
