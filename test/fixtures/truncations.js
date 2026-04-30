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
]
