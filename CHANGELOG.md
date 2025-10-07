# Changelog

## [7.7.3](https://github.com/npm/node-semver/compare/v7.7.2...v7.7.3) (2025-10-06)
### Bug Fixes
* [`e37e0ca`](https://github.com/npm/node-semver/commit/e37e0ca0b5fc910d2b1948d25dbc83cc3a0921ea) [#813](https://github.com/npm/node-semver/pull/813) faster paths for compare (#813) (@H4ad)
* [`2471d75`](https://github.com/npm/node-semver/commit/2471d7543e2e63d9d95358e2405e7e1cde926c36) [#811](https://github.com/npm/node-semver/pull/811) x-range build metadata support (i529015)
### Chores
* [`8f05c87`](https://github.com/npm/node-semver/commit/8f05c87f56a4123259b8c6d9324f53eadb02e48f) [#807](https://github.com/npm/node-semver/pull/807) bump @npmcli/template-oss from 4.25.0 to 4.25.1 (#807) (@dependabot[bot], @owlstronaut)

## [7.7.2](https://github.com/npm/node-semver/compare/v7.7.1...v7.7.2) (2025-05-12)
### Bug Fixes
* [`fcafb61`](https://github.com/npm/node-semver/commit/fcafb61ed566ff8ccf24818dd94b76738f037aa4) [#780](https://github.com/npm/node-semver/pull/780) add missing `'use strict'` directives (#780) (@Fdawgs)
* [`c99f336`](https://github.com/npm/node-semver/commit/c99f336fa3bdff465652f9041eab2127d2f52eb2) [#781](https://github.com/npm/node-semver/pull/781) prerelease identifier starting with digits (#781) (@mbtools)
### Chores
* [`c760403`](https://github.com/npm/node-semver/commit/c760403b935d3ad35f83e9bbe5ebe1badef2fc71) [#784](https://github.com/npm/node-semver/pull/784) template-oss-apply for workflow permissions (#784) (@wraithgar)
* [`2677f2a`](https://github.com/npm/node-semver/commit/2677f2a88334b0e728dbfe9ad9f5f57458437c87) [#778](https://github.com/npm/node-semver/pull/778) bump @npmcli/template-oss from 4.23.6 to 4.24.3 (#778) (@dependabot[bot], @npm-cli-bot)

## [7.7.1](https://github.com/npm/node-semver/compare/v7.7.0...v7.7.1) (2025-02-03)
### Bug Fixes
* [`af761c0`](https://github.com/npm/node-semver/commit/af761c05bd53eef83b5e20f8b09360b0e70557dc) [#764](https://github.com/npm/node-semver/pull/764) inc: fully capture prerelease identifier (#764) (@wraithgar)

## [7.7.0](https://github.com/npm/node-semver/compare/v7.6.3...v7.7.0) (2025-01-29)
### Features
* [`0864b3c`](https://github.com/npm/node-semver/commit/0864b3ce7932667013e0c7c5ec764777d4682883) [#753](https://github.com/npm/node-semver/pull/753) add "release" inc type (#753) (@mbtools)
### Bug Fixes
* [`d588e37`](https://github.com/npm/node-semver/commit/d588e3782864b1cab2fe9f2452b848e8c7f609d1) [#755](https://github.com/npm/node-semver/pull/755) diff: fix prerelease to stable version diff logic (#755) (@eminberkayd, berkay.daglar)
* [`8a34bde`](https://github.com/npm/node-semver/commit/8a34bdecc783407f4e1a8a1ee1f67906b84a4b78) [#754](https://github.com/npm/node-semver/pull/754) add identifier validation to `inc()` (#754) (@mbtools)
### Documentation
* [`67e5478`](https://github.com/npm/node-semver/commit/67e54785a0f871361230f84323cbb631b9b6d834) [#756](https://github.com/npm/node-semver/pull/756) readme: added missing period for consistency (#756) (@shaymolcho)
* [`868d4bb`](https://github.com/npm/node-semver/commit/868d4bbe3d318c52544f38d5f9977a1103e924c2) [#749](https://github.com/npm/node-semver/pull/749) clarify comment about obsolete prefixes (#749) (@mbtools, @ljharb)
### Chores
* [`145c554`](https://github.com/npm/node-semver/commit/145c554b8c7b7ecfcb451153ad18bdb2f24ad10d) [#741](https://github.com/npm/node-semver/pull/741) bump @npmcli/eslint-config from 4.0.5 to 5.0.0 (@dependabot[bot])
* [`753e02b`](https://github.com/npm/node-semver/commit/753e02b9d0cb3ac23e085dc33efcab3e08d61f2b) [#747](https://github.com/npm/node-semver/pull/747) bump @npmcli/template-oss from 4.23.3 to 4.23.4 (#747) (@dependabot[bot], @npm-cli-bot)
* [`0b812d5`](https://github.com/npm/node-semver/commit/0b812d5fb5fbb208e89dc1250e2efafeaa549437) [#744](https://github.com/npm/node-semver/pull/744) postinstall for dependabot template-oss PR (@hashtagchris)

## [7.6.3](https://github.com/npm/node-semver/compare/v7.6.2...v7.6.3) (2024-07-16)

### Bug Fixes

* [`73a3d79`](https://github.com/npm/node-semver/commit/73a3d79c4ec32d5dd62c9d5f64e5af7fbdad9ec0) [#726](https://github.com/npm/node-semver/pull/726) optimize Range parsing and formatting (#726) (@jviide)

### Documentation

* [`2975ece`](https://github.com/npm/node-semver/commit/2975ece120e17660c9f1ef517de45c09ff821064) [#719](https://github.com/npm/node-semver/pull/719) fix extra backtick typo (#719) (@stdavis)

## [7.6.2](https://github.com/npm/node-semver/compare/v7.6.1...v7.6.2) (2024-05-09)

### Bug Fixes

* [`6466ba9`](https://github.com/npm/node-semver/commit/6466ba9b540252db405fdd2a289dd4651495beea) [#713](https://github.com/npm/node-semver/pull/713) lru: use map.delete() directly (#713) (@negezor, @lukekarrys)

## [7.6.1](https://github.com/npm/node-semver/compare/v7.6.0...v7.6.1) (2024-05-04)

### Bug Fixes

* [`c570a34`](https://github.com/npm/node-semver/commit/c570a348ffc6612af07fe94fa46b9affa5e4eff0) [#704](https://github.com/npm/node-semver/pull/704) linting: no-unused-vars (@wraithgar)
* [`ad8ff11`](https://github.com/npm/node-semver/commit/ad8ff11dd200dac3a05097d9a82d1977ccfa1535) [#704](https://github.com/npm/node-semver/pull/704) use internal cache implementation (@mbtools)
* [`ac9b357`](https://github.com/npm/node-semver/commit/ac9b35769ab0ddfefd5a3af4a3ecaf3da2012352) [#682](https://github.com/npm/node-semver/pull/682) typo in compareBuild debug message (#682) (@mbtools)

### Dependencies

* [`988a8de`](https://github.com/npm/node-semver/commit/988a8deb3ea76b9a314a740e66b5fc2f726822f8) [#709](https://github.com/npm/node-semver/pull/709) uninstall `lru-cache` (#709)
* [`3fabe4d`](https://github.com/npm/node-semver/commit/3fabe4dbfbd199fdb589c076a7f30bc1f18c6614) [#704](https://github.com/npm/node-semver/pull/704) remove lru-cache

### Chores

* [`dd09b60`](https://github.com/npm/node-semver/commit/dd09b60da1e618335d7c269426345b336fd5f63d) [#705](https://github.com/npm/node-semver/pull/705) bump @npmcli/template-oss to 4.22.0 (@lukekarrys)
* [`ec49cdc`](https://github.com/npm/node-semver/commit/ec49cdcece9db0020d6829b246681ff65a393644) [#701](https://github.com/npm/node-semver/pull/701) chore: chore: postinstall for dependabot template-oss PR (@lukekarrys)
* [`b236c3d`](https://github.com/npm/node-semver/commit/b236c3d2f357a16a733c96ec2ca8c57848b70091) [#696](https://github.com/npm/node-semver/pull/696) add benchmarks (#696) (@H4ad)
* [`692451b`](https://github.com/npm/node-semver/commit/692451bd6f75b38a71a99f39da405c94a5954a22) [#688](https://github.com/npm/node-semver/pull/688) various improvements to README (#688) (@mbtools)
* [`5feeb7f`](https://github.com/npm/node-semver/commit/5feeb7f4f63061e19a29087115b50cb04135b63e) [#705](https://github.com/npm/node-semver/pull/705) postinstall for dependabot template-oss PR (@lukekarrys)
* [`074156f`](https://github.com/npm/node-semver/commit/074156f64fa91723fe1ae6af8cc497014b9b7aff) [#701](https://github.com/npm/node-semver/pull/701) bump @npmcli/template-oss from 4.21.3 to 4.21.4 (@dependabot[bot])

## [7.6.0](https://github.com/npm/node-semver/compare/v7.5.4...v7.6.0) (2024-01-31)

### Features

* [`a7ab13a`](https://github.com/npm/node-semver/commit/a7ab13a46201e342d34e84a989632b380f755baf) [#671](https://github.com/npm/node-semver/pull/671) preserve pre-release and build parts of a version on coerce (#671) (@madtisa, madtisa, @wraithgar)

### Chores

* [`816c7b2`](https://github.com/npm/node-semver/commit/816c7b2cbfcb1986958a290f941eddfd0441139e) [#667](https://github.com/npm/node-semver/pull/667) postinstall for dependabot template-oss PR (@lukekarrys)
* [`0bd24d9`](https://github.com/npm/node-semver/commit/0bd24d943cbd1a7f6a2b8d384590bfa98559e1de) [#667](https://github.com/npm/node-semver/pull/667) bump @npmcli/template-oss from 4.21.1 to 4.21.3 (@dependabot[bot])
* [`e521932`](https://github.com/npm/node-semver/commit/e521932f115a81030f4e7c34e8631cdd3c6a108b) [#652](https://github.com/npm/node-semver/pull/652) postinstall for dependabot template-oss PR (@lukekarrys)
* [`8873991`](https://github.com/npm/node-semver/commit/88739918080debeb239aae840b35c07436148e50) [#652](https://github.com/npm/node-semver/pull/652) chore: chore: postinstall for dependabot template-oss PR (@lukekarrys)
* [`f317dc8`](https://github.com/npm/node-semver/commit/f317dc8689781bcfd98e2c32b46157276acdd47c) [#652](https://github.com/npm/node-semver/pull/652) bump @npmcli/template-oss from 4.19.0 to 4.21.0 (@dependabot[bot])
* [`7303db1`](https://github.com/npm/node-semver/commit/7303db1fe54d6905b23ccb0162878e37d73535ef) [#658](https://github.com/npm/node-semver/pull/658) add clean() test for build metadata (#658) (@jethrodaniel)
* [`6240d75`](https://github.com/npm/node-semver/commit/6240d75a7c620b0a222f05969a91fdc3dc2be0fb) [#656](https://github.com/npm/node-semver/pull/656) add missing quotes in README.md (#656) (@zyxkad)
* [`14d263f`](https://github.com/npm/node-semver/commit/14d263faa156e408a033b9b12a2f87735c2df42c) [#625](https://github.com/npm/node-semver/pull/625) postinstall for dependabot template-oss PR (@lukekarrys)
* [`7c34e1a`](https://github.com/npm/node-semver/commit/7c34e1ac1bcc0bc6579b30745c96075c69bd0332) [#625](https://github.com/npm/node-semver/pull/625) bump @npmcli/template-oss from 4.18.1 to 4.19.0 (@dependabot[bot])
* [`123e0b0`](https://github.com/npm/node-semver/commit/123e0b03287e1af295ef82d55f55c16805596f35) [#622](https://github.com/npm/node-semver/pull/622) postinstall for dependabot template-oss PR (@lukekarrys)
* [`737d5e1`](https://github.com/npm/node-semver/commit/737d5e1cf10e631bab8a28594aa2d5c9d4090814) [#622](https://github.com/npm/node-semver/pull/622) bump @npmcli/template-oss from 4.18.0 to 4.18.1 (@dependabot[bot])
* [`cce6180`](https://github.com/npm/node-semver/commit/cce61804ba6f997225a1267135c06676fe0524d2) [#598](https://github.com/npm/node-semver/pull/598) postinstall for dependabot template-oss PR (@lukekarrys)
* [`b914a3d`](https://github.com/npm/node-semver/commit/b914a3d0d26ca27d2685053d7d390af4e02eedd9) [#598](https://github.com/npm/node-semver/pull/598) bump @npmcli/template-oss from 4.17.0 to 4.18.0 (@dependabot[bot])

## [7.5.4](https://github.com/npm/node-semver/compare/v7.5.3...v7.5.4) (2023-07-07)

### Bug Fixes

* [`cc6fde2`](https://github.com/npm/node-semver/commit/cc6fde2d34b95cb600d126649d926901bd2a9703) [#588](https://github.com/npm/node-semver/pull/588) trim each range set before parsing (@lukekarrys)
* [`99d8287`](https://github.com/npm/node-semver/commit/99d8287516a1d2abf0286033e2e26eca6b69c09f) [#583](https://github.com/npm/node-semver/pull/583) correctly parse long build ids as valid (#583) (@lukekarrys)

## [7.5.3](https://github.com/npm/node-semver/compare/v7.5.2...v7.5.3) (2023-06-22)

### Bug Fixes

* [`abdd93d`](https://github.com/npm/node-semver/commit/abdd93d55496d22e3c15a454a5cf13f101e48bce) [#571](https://github.com/npm/node-semver/pull/571) set max lengths in regex for numeric and build identifiers (#571) (@lukekarrys)

### Documentation

* [`bf53dd8`](https://github.com/npm/node-semver/commit/bf53dd8da15a17eb6b8111115d0d8ef341fea5db) [#569](https://github.com/npm/node-semver/pull/569) add example for `>` comparator (#569) (@mbtools)

## [7.5.2](https://github.com/npm/node-semver/compare/v7.5.1...v7.5.2) (2023-06-15)

### Bug Fixes

* [`58c791f`](https://github.com/npm/node-semver/commit/58c791f40ba8cf4be35a5ca6644353ecd6249edc) [#566](https://github.com/npm/node-semver/pull/566) diff when detecting major change from prerelease (#566) (@lukekarrys)
* [`5c8efbc`](https://github.com/npm/node-semver/commit/5c8efbcb3c6c125af10746d054faff13e8c33fbd) [#565](https://github.com/npm/node-semver/pull/565) preserve build in raw after inc (#565) (@lukekarrys)
* [`717534e`](https://github.com/npm/node-semver/commit/717534ee353682f3bcf33e60a8af4292626d4441) [#564](https://github.com/npm/node-semver/pull/564) better handling of whitespace (#564) (@lukekarrys)

## [7.5.1](https://github.com/npm/node-semver/compare/v7.5.0...v7.5.1) (2023-05-12)

### Bug Fixes

* [`d30d25a`](https://github.com/npm/node-semver/commit/d30d25a5c1fb963c3cc9178cb1769fe45e4a3cab) [#559](https://github.com/npm/node-semver/pull/559) show type on invalid semver error (#559) (@tjenkinson)

## [7.5.0](https://github.com/npm/node-semver/compare/v7.4.0...v7.5.0) (2023-04-17)

### Features

* [`503a4e5`](https://github.com/npm/node-semver/commit/503a4e52fe2b1c6ed1400d33149f7733c8361eed) [#548](https://github.com/npm/node-semver/pull/548) allow identifierBase to be false (#548) (@lsvalina)

### Bug Fixes

* [`e219bb4`](https://github.com/npm/node-semver/commit/e219bb454036a0c23e34407591f921c8edb688e7) [#552](https://github.com/npm/node-semver/pull/552) throw on bad version with correct error message (#552) (@wraithgar)
* [`fc2f3df`](https://github.com/npm/node-semver/commit/fc2f3df0b5d25253b3580607e111a9a280d888ca) [#546](https://github.com/npm/node-semver/pull/546) incorrect results from diff sometimes with prerelease versions (#546) (@tjenkinson)
* [`2781767`](https://github.com/npm/node-semver/commit/27817677794f592b592bf6181a80a4824ff762b2) [#547](https://github.com/npm/node-semver/pull/547) avoid re-instantiating SemVer during diff compare (#547) (@macno)

## [7.4.0](https://github.com/npm/node-semver/compare/v7.3.8...v7.4.0) (2023-04-10)

### Features

* [`113f513`](https://github.com/npm/node-semver/commit/113f51312a1a6b6aa50d4f9486b4fde21782c1f5) [#532](https://github.com/npm/node-semver/pull/532) identifierBase parameter for .inc (#532) (@wraithgar, @b-bly)
* [`48d8f8f`](https://github.com/npm/node-semver/commit/48d8f8fa63bf6e35db70ff840b6da1a51596a5a8) [#530](https://github.com/npm/node-semver/pull/530) export new RELEASE_TYPES constant (@hcharley)

### Bug Fixes

* [`940723d`](https://github.com/npm/node-semver/commit/940723d22bca824993627c45ac30dd3d2854b8cd) [#538](https://github.com/npm/node-semver/pull/538) intersects with v0.0.0 and v0.0.0-0 (#538) (@wraithgar)
* [`aa516b5`](https://github.com/npm/node-semver/commit/aa516b50b32f5a144017d8fc1b9efe0540963c91) [#535](https://github.com/npm/node-semver/pull/535) faster parse options (#535) (@H4ad)
* [`61e6ea1`](https://github.com/npm/node-semver/commit/61e6ea1e9b7af01baf19ab0c0a63c8e3ebfac97c) [#536](https://github.com/npm/node-semver/pull/536) faster cache key factory for range (#536) (@H4ad)
* [`f8b8b61`](https://github.com/npm/node-semver/commit/f8b8b619e71746a47852a9d301f3087ab311444f) [#541](https://github.com/npm/node-semver/pull/541) optimistic parse (#541) (@H4ad)
* [`796cbe2`](https://github.com/npm/node-semver/commit/796cbe29b06d102e1b16f3ed78eaba210ece951e) [#533](https://github.com/npm/node-semver/pull/533) semver.diff prerelease to release recognition (#533) (@wraithgar, @dominique-blockchain)
* [`3f222b1`](https://github.com/npm/node-semver/commit/3f222b144033525ca9f8a2ce5bc6e02f0401881f) [#537](https://github.com/npm/node-semver/pull/537) reuse comparators on subset (#537) (@H4ad)
* [`f66cc45`](https://github.com/npm/node-semver/commit/f66cc45c6e82eebb4b5b51af73e7b8dcaeda7e21) [#539](https://github.com/npm/node-semver/pull/539) faster diff (#539) (@H4ad)

### Documentation

* [`c5d29df`](https://github.com/npm/node-semver/commit/c5d29df6f75741fea27fffe3b88c9c3b28e3ca73) [#530](https://github.com/npm/node-semver/pull/530) Add "Constants" section to README (@hcharley)

## [7.3.8](https://github.com/npm/node-semver/compare/v7.3.7...v7.3.8) (2022-10-04)

### Bug Fixes

* [`d8ef32c`](https://github.com/npm/node-semver/commit/d8ef32cee7a7e34310838f32451c9bcf52956b64) [#383](https://github.com/npm/node-semver/pull/383) add support for node.js esm auto exports (#383) (@MylesBorins)

### Documentation

* [`7209b14`](https://github.com/npm/node-semver/commit/7209b14ccd7ca35b9a1077a0b67d9ce884fe6d00) [#477](https://github.com/npm/node-semver/pull/477) update range.js comments to clarify the caret ranges examples (#477) (@amitse)

### [7.3.7](https://github.com/npm/node-semver/compare/v7.3.6...v7.3.7) (2022-04-11)


### Bug Fixes

* allow node >=10 ([85b269a](https://github.com/npm/node-semver/commit/85b269a90806713d2a41e8e990b0ea6bc274b171))
* **bin:** get correct value from arg separated by equals ([#449](https://github.com/npm/node-semver/issues/449)) ([4ceca76](https://github.com/npm/node-semver/commit/4ceca76729c577166395f19172854cbbcce3cec1)), closes [#431](https://github.com/npm/node-semver/issues/431)
* ensure SemVer instance passed to inc are not modified ([#427](https://github.com/npm/node-semver/issues/427)) ([f070dde](https://github.com/npm/node-semver/commit/f070dde0cc22894ac254e281cb36a79ab790272d))
* inc prerelease with numeric preid ([#380](https://github.com/npm/node-semver/issues/380)) ([802e161](https://github.com/npm/node-semver/commit/802e16174fe2a704dba16e97891ce36dc4f2ad76))


### Dependencies

* revert to lru-cache@6 ([22ae54d](https://github.com/npm/node-semver/commit/22ae54d66c2dec8200947066dbb9c33bb729b8a8))

### [7.3.6](https://github.com/npm/node-semver/compare/v7.3.5...v7.3.6) (2022-04-05)


### Bug Fixes

* https://github.com/npm/node-semver/issues/329 ([cb1ca1d](https://github.com/npm/node-semver/commit/cb1ca1d5480a6c07c12ac31ba5f2071ed530c4ed))
* properly escape dots in `GTE0` regexes ([#432](https://github.com/npm/node-semver/issues/432)) ([11494f1](https://github.com/npm/node-semver/commit/11494f1446a907c8fa5d9cfbc9fab04d553311f5))
* replace deprecated String.prototype.substr() ([#445](https://github.com/npm/node-semver/issues/445)) ([e2d55e7](https://github.com/npm/node-semver/commit/e2d55e79f0d288ea88c0e0ba6620fe5636a4a552))
* replace regex used to split ranges ([#434](https://github.com/npm/node-semver/issues/434)) ([9ab7b71](https://github.com/npm/node-semver/commit/9ab7b717dd7848c639b8ce3366d2241d430cdad2))


### Documentation

* clarify * range behavior ([cb1ca1d](https://github.com/npm/node-semver/commit/cb1ca1d5480a6c07c12ac31ba5f2071ed530c4ed))


### Dependencies

* lru-cache@7.4.0 ([#442](https://github.com/npm/node-semver/issues/442)) ([9a3064c](https://github.com/npm/node-semver/commit/9a3064c242cdce3c1c39cae37a83d93ead363b37))
* tap@16.0.0 ([#439](https://github.com/npm/node-semver/issues/439)) ([60cbb3f](https://github.com/npm/node-semver/commit/60cbb3fd4a4d32979f3aa0a2aa4e185753106545))

## 7.3.0

* Add `subset(r1, r2)` method to determine if `r1` range is entirely
  contained by `r2` range.

## 7.2.3

* Fix handling of `includePrelease` mode where version ranges like `1.0.0 -
  2.0.0` would include `3.0.0-pre` and not `1.0.0-pre`.

## 7.2.2

* Fix bug where `2.0.0-pre` would be included in `^1.0.0` if
  `includePrerelease` was set to true.

## 7.2.0

* Add `simplifyRange` method to attempt to generate a more human-readable
  range expression that is equivalent to a supplied range, for a given set
  of versions.

## 7.1.2

* Remove fancy lazy-loading logic, as it was causing problems for webpack
  users.

## 7.1.0

* Add `require('semver/preload')` to load the entire module without using
  lazy getter methods.

## 7.0.0

* Refactor module into separate files for better tree-shaking
* Drop support for very old node versions, use const/let, `=>` functions,
  and classes.

## 6.3.0

* Expose the token enum on the exports

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
