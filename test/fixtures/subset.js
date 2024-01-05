// sub, sup, expect, [options]
module.exports = [
  ['1.2.3', '1.2.3', true],
  ['1.2.3', '1.x', true],
  ['1.2.3 1.2.4', '1.2.3', true],
  ['1.2.3 1.2.4', '1.2.9', true], // null set is subset of everything
  ['1.2.3', '>1.2.0', true],
  ['1.2.3 2.3.4 || 2.3.4', '3', false],
  ['^1.2.3-pre.0', '1.x', false],
  ['^1.2.3-pre.0', '1.x', true, { includePrerelease: true }],
  ['>2 <1', '3', true],
  ['1 || 2 || 3', '>=1.0.0', true],

  // everything is a subset of *
  ['1.2.3', '*', true],
  ['^1.2.3', '*', true],
  ['^1.2.3-pre.0', '*', false],
  ['^1.2.3-pre.0', '*', true, { includePrerelease: true }],
  ['1 || 2 || 3', '*', true],

  // prerelease edge cases
  ['^1.2.3-pre.0', '>=1.0.0', false],
  ['^1.2.3-pre.0', '>=1.0.0', true, { includePrerelease: true }],
  ['^1.2.3-pre.0', '>=1.2.3-pre.0', true],
  ['^1.2.3-pre.0', '>=1.2.3-pre.0', true, { includePrerelease: true }],
  ['>1.2.3-pre.0', '>=1.2.3-pre.0', true],
  ['>1.2.3-pre.0', '>1.2.3-pre.0 || 2', true],
  ['1 >1.2.3-pre.0', '>1.2.3-pre.0', true],
  ['1 <=1.2.3-pre.0', '>=1.0.0-0', false],
  ['1 <=1.2.3-pre.0', '>=1.0.0-0', true, { includePrerelease: true }],
  ['1 <=1.2.3-pre.0', '<=1.2.3-pre.0', true],
  ['1 <=1.2.3-pre.0', '<=1.2.3-pre.0', true, { includePrerelease: true }],
  ['<1.2.3-pre.0', '<=1.2.3-pre.0', true],
  ['<1.2.3-pre.0', '<1.2.3-pre.0 || 2', true],
  ['1 <1.2.3-pre.0', '<1.2.3-pre.0', true],

  ['*', '*', true],
  ['', '*', true],
  ['*', '', true],
  ['', '', true],

  // >=0.0.0 is like * in non-prerelease mode
  // >=0.0.0-0 is like * in prerelease mode
  ['*', '>=0.0.0-0', true, { includePrerelease: true }],

  // true because these are identical in non-PR mode
  ['*', '>=0.0.0', true],

  // false because * includes 0.0.0-0 in PR mode
  ['*', '>=0.0.0', false, { includePrerelease: true }],

  // true because * doesn't include 0.0.0-0 in non-PR mode
  ['*', '>=0.0.0-0', true],

  ['^2 || ^3 || ^4', '>=1', true],
  ['^2 || ^3 || ^4', '>1', true],
  ['^2 || ^3 || ^4', '>=2', true],
  ['^2 || ^3 || ^4', '>=3', false],
  ['>=1', '^2 || ^3 || ^4', false],
  ['>1', '^2 || ^3 || ^4', false],
  ['>=2', '^2 || ^3 || ^4', false],
  ['>=3', '^2 || ^3 || ^4', false],
  ['^1', '^2 || ^3 || ^4', false],
  ['^2', '^2 || ^3 || ^4', true],
  ['^3', '^2 || ^3 || ^4', true],
  ['^4', '^2 || ^3 || ^4', true],
  ['1.x', '^2 || ^3 || ^4', false],
  ['2.x', '^2 || ^3 || ^4', true],
  ['3.x', '^2 || ^3 || ^4', true],
  ['4.x', '^2 || ^3 || ^4', true],

  ['>=1.0.0 <=1.0.0 || 2.0.0', '1.0.0 || 2.0.0', true],
  ['<=1.0.0 >=1.0.0 || 2.0.0', '1.0.0 || 2.0.0', true],
  ['>=1.0.0', '1.0.0', false],
  ['>=1.0.0 <2.0.0', '<2.0.0', true],
  ['>=1.0.0 <2.0.0', '>0.0.0', true],
  ['>=1.0.0 <=1.0.0', '1.0.0', true],
  ['>=1.0.0 <=1.0.0', '2.0.0', false],
  ['<2.0.0', '>=1.0.0 <2.0.0', false],
  ['>=1.0.0', '>=1.0.0 <2.0.0', false],
  ['>=1.0.0 <2.0.0', '<2.0.0', true],
  ['>=1.0.0 <2.0.0', '>=1.0.0', true],
  ['>=1.0.0 <2.0.0', '>1.0.0', false],
  ['>=1.0.0 <=2.0.0', '<2.0.0', false],
  ['>=1.0.0', '<1.0.0', false],
  ['<=1.0.0', '>1.0.0', false],
  ['<=1.0.0 >1.0.0', '>1.0.0', true],
  ['1.0.0 >1.0.0', '>1.0.0', true],
  ['1.0.0 <1.0.0', '>1.0.0', true],
  ['<1 <2 <3', '<4', true],
  ['<3 <2 <1', '<4', true],
  ['>1 >2 >3', '>0', true],
  ['>3 >2 >1', '>0', true],
  ['<=1 <=2 <=3', '<4', true],
  ['<=3 <=2 <=1', '<4', true],
  ['>=1 >=2 >=3', '>0', true],
  ['>=3 >=2 >=1', '>0', true],
  ['>=3 >=2 >=1', '>=3 >=2 >=1', true],
  ['>2.0.0', '>=2.0.0', true],
]
