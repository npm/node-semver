# Changelog

## [6.3.2](https://github.com/npm/node-semver/compare/v6.3.1...v6.3.2) (2024-04-21)

### Chores

* [`ee64c7f`](https://github.com/npm/node-semver/commit/ee64c7f8e2749e2152723eed6afe14cf6e500a23) [#700](https://github.com/npm/node-semver/pull/700) chore: postinstall for dependabot template-oss PR (@lukekarrys)
* [`0dfc8fa`](https://github.com/npm/node-semver/commit/0dfc8fa1f7a25eda59a70bdd484a6d78657fce3a) [#624](https://github.com/npm/node-semver/pull/624) auto publish (@lukekarrys)
* [`360be89`](https://github.com/npm/node-semver/commit/360be890c85454657a8d823223847aaa76c2e1f6) [#700](https://github.com/npm/node-semver/pull/700) bump @npmcli/template-oss from 4.21.3 to 4.21.4 (@dependabot[bot])
* [`bcdd8dd`](https://github.com/npm/node-semver/commit/bcdd8dd754312780128adf7894b287347cad9652) [#653](https://github.com/npm/node-semver/pull/653) postinstall for dependabot template-oss PR (@lukekarrys)

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
