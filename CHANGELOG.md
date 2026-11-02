# Changelog

## [6.3.2](https://github.com/npm/node-semver/compare/v6.3.1...v6.3.2) (2026-11-02)
### Bug Fixes
* [`f4ed953`](https://github.com/npm/node-semver/commit/f4ed953b48d187cf373b14541f4ced5710dc7fc6) [#925](https://github.com/npm/node-semver/pull/925) backport v7 range parsing performance improvement to v6 (#925) (@reggi, @Copilot)
### Chores
* [`9a3f125`](https://github.com/npm/node-semver/commit/9a3f1258a638996d31a7f8c8403cb1e4dac78bf9) [#924](https://github.com/npm/node-semver/pull/924) backport v7 range parsing coverage to v6 (#924) (@reggi, @Copilot)
* [`f623d0d`](https://github.com/npm/node-semver/commit/f623d0d5c4c3bffdbcb0d1985c604ec194d15d84) [#707](https://github.com/npm/node-semver/pull/707) deps: `@npmcli/template-oss@4.22.0` (#707) (@lukekarrys)
* [`ee64c7f`](https://github.com/npm/node-semver/commit/ee64c7f8e2749e2152723eed6afe14cf6e500a23) [#700](https://github.com/npm/node-semver/pull/700) chore: postinstall for dependabot template-oss PR (@lukekarrys)
* [`0dfc8fa`](https://github.com/npm/node-semver/commit/0dfc8fa1f7a25eda59a70bdd484a6d78657fce3a) [#624](https://github.com/npm/node-semver/pull/624) auto publish (@lukekarrys)
* [`5381b0c`](https://github.com/npm/node-semver/commit/5381b0c19709f0717f392f07b6845ce553663715) [#842](https://github.com/npm/node-semver/pull/842) bump @npmcli/template-oss from 4.25.1 to 4.29.0 (#842) (@dependabot[bot], @wraithgar)
* [`e37e8d4`](https://github.com/npm/node-semver/commit/e37e8d4a5a4da75f875d21e21921485728e100ab) [#733](https://github.com/npm/node-semver/pull/733) postinstall for dependabot template-oss PR (@hashtagchris)

## [6.3.1](https://github.com/npm/node-semver/compare/v6.3.0...v6.3.1) (2023-07-10)

### Bug Fixes

* [`928e56d`](https://github.com/npm/node-semver/commit/928e56d21150da0413a3333a3148b20e741a920c) [#591](https://github.com/npm/node-semver/pull/591) better handling of whitespace (#591) (@lukekarrys, @joaomoreno, @nicolo-ribaudo)

## 6.2.0

* Coerce numbers to strings when passed to semver.coerce()
* Add `rtl` option to coerce from right to left

## 6.1.3

* Handle X-ranges properly in includePrerelease mode

## 6.1.2

* Do not throw when testing invalid version strings

## 6.1.1

* Add options support for semver.coerce()
* Handle undefined version passed to Range.test

## 6.1.0

* Add semver.compareBuild function
* Support `*` in semver.intersects

## 6.0

* Fix `intersects` logic.

    This is technically a bug fix, but since it is also a change to behavior
    that may require users updating their code, it is marked as a major
    version increment.

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
