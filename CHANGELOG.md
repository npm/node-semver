# Changelog

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
