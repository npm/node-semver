# Changelog

## [5.7.3](https://github.com/npm/node-semver/compare/v5.7.2...v5.7.3) (2026-11-02)
### Bug Fixes
* [`7227001`](https://github.com/npm/node-semver/commit/722700169ff904de775fb1b2b09dce700ff050b8) [#927](https://github.com/npm/node-semver/pull/927) backport v7 range parsing performance improvement to v5 (#927) (@reggi, @Copilot)
### Chores
* [`566e22f`](https://github.com/npm/node-semver/commit/566e22f0742d96c40425072518bd9b5c94590193) [#942](https://github.com/npm/node-semver/pull/942) publish v5 releases to the legacy dist-tag (#942) (@reggi, @Copilot)
* [`b827b90`](https://github.com/npm/node-semver/commit/b827b902f3e4ae87b11db35ed69209a3951c7dbc) [#926](https://github.com/npm/node-semver/pull/926) backport v7 range parsing coverage to v5 (#926) (@reggi, @Copilot)
* [`9246ad5`](https://github.com/npm/node-semver/commit/9246ad5233c3eeb2c17fe22a36614464bb4fc31a) [#708](https://github.com/npm/node-semver/pull/708) deps: `@npmcli/template-oss@4.22.0` (#708) (@lukekarrys)
* [`d7654e3`](https://github.com/npm/node-semver/commit/d7654e384c6ce8dda37a988613415383a3503e6a) [#623](https://github.com/npm/node-semver/pull/623) auto publish (@lukekarrys)
* [`2783af2`](https://github.com/npm/node-semver/commit/2783af203701690e6cd2144323d664d563590210) [#851](https://github.com/npm/node-semver/pull/851) bump @npmcli/template-oss from 4.29.0 to 4.30.0 (#851) (@dependabot[bot], Michael Smith)
* [`1ed65a5`](https://github.com/npm/node-semver/commit/1ed65a5d397a335a731721a5d74fa0e8936ee038) [#734](https://github.com/npm/node-semver/pull/734) postinstall for dependabot template-oss PR (@hashtagchris)

## [5.7.2](https://github.com/npm/node-semver/compare/v5.7.1...v5.7.2) (2023-07-10)

### Bug Fixes

* [`2f8fd41`](https://github.com/npm/node-semver/commit/2f8fd41487acf380194579ecb6f8b1bbfe116be0) [#585](https://github.com/npm/node-semver/pull/585) better handling of whitespace (#585) (@joaomoreno, @lukekarrys)

## 5.7

* Add `minVersion` method

## 5.6

* Move boolean `loose` param to an options object, with
  backwards-compatibility protection.
* Add ability to opt out of special prerelease version handling with
  the `includePrerelease` option flag.

## 5.5

* Add version coercion capabilities

## 5.4

* Add intersection checking

## 5.3

* Add `minSatisfying` method

## 5.2

* Add `prerelease(v)` that returns prerelease components

## 5.1

* Add Backus-Naur for ranges
* Remove excessively cute inspection methods

## 5.0

* Remove AMD/Browserified build artifacts
* Fix ltr and gtr when using the `*` range
* Fix for range `*` with a prerelease identifier
