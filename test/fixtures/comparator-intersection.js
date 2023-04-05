// c0, c1, expected intersection
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
]
