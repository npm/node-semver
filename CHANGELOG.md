# Changelog

## [5.7.3](https://github.com/npm/node-semver/compare/v5.7.2...v5.7.3) (2024-04-21)

### Chores

* [`d7654e3`](https://github.com/npm/node-semver/commit/d7654e384c6ce8dda37a988613415383a3503e6a) [#623](https://github.com/npm/node-semver/pull/623) auto publish (@lukekarrys)
* [`3969129`](https://github.com/npm/node-semver/commit/3969129c82cce0d1bad50a0f926d93a676536c8c) [#699](https://github.com/npm/node-semver/pull/699) postinstall for dependabot template-oss PR (@lukekarrys)
* [`9f96d5b`](https://github.com/npm/node-semver/commit/9f96d5bc47dacc2a3fdd7c971e09599256d9ad5e) [#699](https://github.com/npm/node-semver/pull/699) bump @npmcli/template-oss from 4.21.3 to 4.21.4 (@dependabot[bot])

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
