'use strict'

// c0, c1, expected intersection, includePrerelease
module.exports = [
  // One is a Version
  ['1.3.0', '>=1.3.0', true],
  ['1.3.0', '>1.3.0', false],
  ['>=1.3.0', '1.3.0', true],
  ['>1.3.0', '1.3.0', false],
  // Same direction increasing
  ['>1.3.0', '>1.2.0', true],
  ['>1.2.0', '>1.3.0', true],
  ['>=1.2.0', '>1.3.0', true],
  ['>1.2.0', '>=1.3.0', true],
  // Same direction decreasing
  ['<1.3.0', '<1.2.0', true],
  ['<1.2.0', '<1.3.0', true],
  ['<=1.2.0', '<1.3.0', true],
  ['<1.2.0', '<=1.3.0', true],
  // Different directions, same semver and inclusive operator
  ['>=1.3.0', '<=1.3.0', true],
  ['>=v1.3.0', '<=1.3.0', true],
  ['>=1.3.0', '>=1.3.0', true],
  ['<=1.3.0', '<=1.3.0', true],
  ['<=1.3.0', '<=v1.3.0', true],
  ['>1.3.0', '<=1.3.0', false],
  ['>=1.3.0', '<1.3.0', false],
  // Opposite matching directions
  ['>1.0.0', '<2.0.0', true],
  ['>=1.0.0', '<2.0.0', true],
  ['>=1.0.0', '<=2.0.0', true],
  ['>1.0.0', '<=2.0.0', true],
  ['<=2.0.0', '>1.0.0', true],
  ['<=1.0.0', '>=2.0.0', false],
  ['', '', true],
  ['', '>1.0.0', true],
  ['<=2.0.0', '', true],
  ['<0.0.0', '<0.1.0', false],
  ['<0.1.0', '<0.0.0', false],
  ['<0.0.0-0', '<0.1.0', false],
  ['<0.1.0', '<0.0.0-0', false],
  ['<0.0.0-0', '<0.1.0', false, true],
  ['<0.1.0', '<0.0.0-0', false, true],
  // A `<0.0.0-<id>` comparator (with a non-minimal prerelease) is NOT the empty
  // set: it matches prereleases below `<id>` such as `0.0.0-0`, so it can
  // intersect other ranges. Only `<0.0.0` and `<0.0.0-0` match nothing. See #521.
  ['<0.0.0-rc.1', '>=0.0.0-alpha.0', true],
  ['<0.0.0-rc.1', '>0.0.0-alpha.0', true],
  ['<0.0.0-beta', '>=0.0.0-alpha', true],
  ['<0.0.0-alpha', '<0.0.0-rc.1', true],
  ['<0.0.0', '>=0.0.0-alpha.0', false],
  ['<0.0.0', '>0.0.0-alpha.0', false],
]
