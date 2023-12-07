# Changelog

## [5.7.3](https://github.com/npm/node-semver/compare/v5.7.2...v5.7.3) (2023-12-07)

### Chores

* [`8492f12`](https://github.com/npm/node-semver/commit/8492f12f17f25adf39cd9a5c82e2535a47add5bc) [#666](https://github.com/npm/node-semver/pull/666) postinstall for dependabot template-oss PR (@lukekarrys)
* [`360888d`](https://github.com/npm/node-semver/commit/360888d722153ca3b0d53ab787bd05846ab6b6c6) [#666](https://github.com/npm/node-semver/pull/666) bump @npmcli/template-oss from 4.21.1 to 4.21.3 (@dependabot[bot])
* [`47861f5`](https://github.com/npm/node-semver/commit/47861f5756bb43903c8694d639ccfe7b57f9cc6b) [#654](https://github.com/npm/node-semver/pull/654) postinstall for dependabot template-oss PR (@lukekarrys)
* [`020601c`](https://github.com/npm/node-semver/commit/020601c891014abb240a0bddc3881fdea2ec8582) [#654](https://github.com/npm/node-semver/pull/654) bump @npmcli/template-oss from 4.19.0 to 4.20.1 (@dependabot[bot])
* [`d7654e3`](https://github.com/npm/node-semver/commit/d7654e384c6ce8dda37a988613415383a3503e6a) [#623](https://github.com/npm/node-semver/pull/623) auto publish (@lukekarrys)
* [`611eca4`](https://github.com/npm/node-semver/commit/611eca4549ed8aad1a80b064bf1fe408497c7af4) [#623](https://github.com/npm/node-semver/pull/623) postinstall for dependabot template-oss PR (@lukekarrys)
* [`869b3b4`](https://github.com/npm/node-semver/commit/869b3b4b0a4f0816c17e6dd2ab553cdf20df334d) [#623](https://github.com/npm/node-semver/pull/623) bump @npmcli/template-oss from 4.17.0 to 4.18.1 (@dependabot[bot])

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
