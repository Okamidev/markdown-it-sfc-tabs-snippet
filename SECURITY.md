# Security Policy

## Supported versions

Only the latest published version receives security fixes. While the package is in `0.x`, fixes
ship in a new minor or patch release rather than being backported.

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Report it privately instead, through GitHub's
[private vulnerability reporting](https://github.com/Okamidev/markdown-it-sfc-tabs-snippet/security/advisories/new),
or by email to sylvain@okamidev.com if you can't use GitHub.

Please include:

- the affected version,
- a description of the issue and its impact,
- steps or a minimal markdown/SFC example that reproduces it.

You can expect an acknowledgement within a week. Once the issue is confirmed, a fix is prepared
and released, and the report is credited in the advisory unless you prefer otherwise.

## Scope

The plugin treats the markdown it renders as trusted, like VitePress's own `<<<` snippet operator:
a `<<<vue` line can read any file the build process can read. Rendering untrusted markdown with
this plugin enabled is therefore not a supported use, and reports that only rely on choosing the
path are out of scope.

In scope, for example: content of an imported SFC (block contents, `lang` attributes, custom block
names) ending up unescaped in the rendered HTML.
