# Changelog

## [6.3.2](https://github.com/npm/node-semver/compare/v6.3.1...v6.3.2) (2023-12-07)

### Chores

* [`e23c0ab`](https://github.com/npm/node-semver/commit/e23c0ab358943ff038f4bdb13dc6a19853bbb90d) [#668](https://github.com/npm/node-semver/pull/668) bump @npmcli/template-oss from 4.21.1 to 4.21.3 (@dependabot[bot])
* [`bcdd8dd`](https://github.com/npm/node-semver/commit/bcdd8dd754312780128adf7894b287347cad9652) [#653](https://github.com/npm/node-semver/pull/653) postinstall for dependabot template-oss PR (@lukekarrys)
* [`39ffabc`](https://github.com/npm/node-semver/commit/39ffabcc2a9fc302ad267323f38e909449daec37) [#653](https://github.com/npm/node-semver/pull/653) bump @npmcli/template-oss from 4.19.0 to 4.21.1 (@dependabot[bot])
* [`0dfc8fa`](https://github.com/npm/node-semver/commit/0dfc8fa1f7a25eda59a70bdd484a6d78657fce3a) [#624](https://github.com/npm/node-semver/pull/624) auto publish (@lukekarrys)
* [`8618ea0`](https://github.com/npm/node-semver/commit/8618ea0c63061a206176b9c05d14518772313a6f) [#624](https://github.com/npm/node-semver/pull/624) postinstall for dependabot template-oss PR (@lukekarrys)
* [`3079a07`](https://github.com/npm/node-semver/commit/3079a0769e1a26e3547d22e7675b88d136e88ee7) [#624](https://github.com/npm/node-semver/pull/624) bump @npmcli/template-oss from 4.17.0 to 4.19.0 (@dependabot[bot])

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
