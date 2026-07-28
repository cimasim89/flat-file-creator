# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.3] - 2026-07-28

First stable release of the v3 line. Previous 3.x versions were published under the
`next` dist-tag only (`3.0.0-next.0`, `3.0.1-next.0`, `3.0.2-next.0`) and are superseded
by this release.

v3 is a clean break from v2. See [Migrating from v2 to v3](README.md#migrating-from-v2-to-v3)
for the full upgrade guide.

### Breaking changes

- **Node.js >= 20 required.** v2 supported Node.js 10+.
- **Pure ESM.** The package can no longer be `require()`'d. Projects still on CommonJS
  should stay on v2.
- **`moment` replaced by `date-fns`.** Date format tokens changed: `YYYY` becomes `yyyy`,
  `DD` becomes `dd`. `HH`, `mm` and `ss` are unchanged.
- **`Moment` removed from `DateFieldValue`.** Date fields accept `Date` or `string`.
- **Date fields return `Date` instead of `Moment`.** Use the native Date API.
- **`getAsyncFlatFileCreator` returns `Promise<void>`** instead of `Promise<string[]>`.
  The previous return value was an array of file paths, one per row, with no practical use.

### Added

- `typescript` as an optional peer dependency (`>=4.7`).
- `build` and `clean` scripts; `prepublishOnly` now runs typecheck, lint, tests and build.

### Changed

- Test runner migrated from Jest to Vitest.
- ESLint 10 flat config, Prettier 3, Husky 9.
- TypeScript build uses NodeNext module resolution.
- Published files restricted to `dist` and `README.md`.
- Runtime dependencies use caret ranges so npm can dedupe them in consumer installs.
- `date-fns` updated to 4.4.0.
- README rewritten with API reference, options, type definitions and migration guide.

### Fixed

- **Row ordering is now guaranteed.** File writes are serialized through a single
  `WriteStream`, so rows are always written in the same order as the input array
  ([#293](https://github.com/cimasim89/flat-file-creator/issues/293)).
- Invalid date strings are validated and raise an error instead of silently producing
  a blank field.
- Non-deterministic date handling in date formatting.
- Field maps are validated with `Array.isArray` in `rowFormatter`.
- Integer padding documentation corrected to match actual behaviour.

### Security

- Cleared all outstanding advisories in the development toolchain (`vite`, `postcss`,
  `brace-expansion`, `fast-uri`, `js-yaml`). These were development-only and never
  reached consumers: the published package contains only `dist` and `README.md`.

## [2.3.0] - 2026-04-14

Last feature release of the v2 line. v2 is now in maintenance and receives security
fixes only. Install it explicitly with `npm install flat-file-creator@v2`.

### Fixed

- File writing rewritten with `WriteStream` to preserve row ordering and improve
  performance ([#293](https://github.com/cimasim89/flat-file-creator/issues/293)).

## Earlier releases

Releases before 2.3.0 predate this changelog. See the
[releases page](https://github.com/cimasim89/flat-file-creator/releases) and the
commit history for details.

[3.0.3]: https://github.com/cimasim89/flat-file-creator/compare/v2.3.0...v3.0.3
[2.3.0]: https://github.com/cimasim89/flat-file-creator/compare/v2.2.1...v2.3.0
