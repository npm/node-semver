'use strict'

// [version, releaseType, result]
// truncate(version, type) -> result
module.exports = [
  ['1.2.3-foo', 'patch', '1.2.3'],
  ['1.2.3', 'patch', '1.2.3'],
  ['1.2.3', 'minor', '1.2.0'],
  ['1.2.3', 'major', '1.0.0'],

  // invalid inputs
  ['1.2.3', 'fake', null],
  ['fake', 'major', null],

  // additional pre-release, build, and pre+build inputs
  ['4.5.6-rc2', 'prerelease', '4.5.6-rc2'],
  ['4.5.6-rc2', 'prepatch', '4.5.6-rc2'],
  ['4.5.6-rc2', 'preminor', '4.5.6-rc2'],
  ['4.5.6-rc2', 'premajor', '4.5.6-rc2'],
  ['4.5.6-rc2', 'patch', '4.5.6'],
  ['4.5.6-rc2', 'minor', '4.5.0'],
  ['4.5.6-rc2', 'major', '4.0.0'],

  ['4.5.6+dadb0d', 'prerelease', '4.5.6'],
  ['4.5.6+dadb0d', 'prepatch', '4.5.6'],
  ['4.5.6+dadb0d', 'preminor', '4.5.6'],
  ['4.5.6+dadb0d', 'premajor', '4.5.6'],
  ['4.5.6+dadb0d', 'patch', '4.5.6'],
  ['4.5.6+dadb0d', 'minor', '4.5.0'],
  ['4.5.6+dadb0d', 'major', '4.0.0'],

  ['4.5.6-rc2+dadb0d', 'prerelease', '4.5.6-rc2'],
  ['4.5.6-rc2+dadb0d', 'prepatch', '4.5.6-rc2'],
  ['4.5.6-rc2+dadb0d', 'preminor', '4.5.6-rc2'],
  ['4.5.6-rc2+dadb0d', 'premajor', '4.5.6-rc2'],
  ['4.5.6-rc2+dadb0d', 'patch', '4.5.6'],
  ['4.5.6-rc2+dadb0d', 'minor', '4.5.0'],
  ['4.5.6-rc2+dadb0d', 'major', '4.0.0'],
]
