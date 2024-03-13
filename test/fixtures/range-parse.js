// [range, canonical result, options]
// null result means it's not a valid range
// '*' is the return value from functions.validRange(), but
// new Range().range will be '' in those cases
const { MAX_SAFE_INTEGER } = require('../../internal/constants')
module.exports = [
  ['1.0.0 - 2.0.0', '>=1.0.0 <=2.0.0'],
  ['1.0.0 - 2.0.0', '>=1.0.0-0 <2.0.1-0', { includePrerelease: true }],
  ['1 - 2', '>=1.0.0 <3.0.0-0'],
  ['1 - 2', '>=1.0.0-0 <3.0.0-0', { includePrerelease: true }],
  ['1.0 - 2.0', '>=1.0.0 <2.1.0-0'],
  ['1.0 - 2.0', '>=1.0.0-0 <2.1.0-0', { includePrerelease: true }],
  ['1.0.0', '1.0.0', { loose: false }],
  ['>=*', '*'],
  ['', '*'],
  ['*', '*'],
  ['>=1.0.0', '>=1.0.0'],
  ['>1.0.0', '>1.0.0'],
  ['<=2.0.0', '<=2.0.0'],
  ['1', '>=1.0.0 <2.0.0-0'],
  ['<2.0.0', '<2.0.0'],
  ['>= 1.0.0', '>=1.0.0'],
  ['>=  1.0.0', '>=1.0.0'],
  ['>=   1.0.0', '>=1.0.0'],
  ['> 1.0.0', '>1.0.0'],
  ['>  1.0.0', '>1.0.0'],
  ['<=   2.0.0', '<=2.0.0'],
  ['<= 2.0.0', '<=2.0.0'],
  ['<=  2.0.0', '<=2.0.0'],
  ['<    2.0.0', '<2.0.0'],
  ['<\t2.0.0', '<2.0.0'],
  ['>=0.1.97', '>=0.1.97'],
  ['0.1.20 || 1.2.4', '0.1.20||1.2.4'],
  ['>=0.2.3 || <0.0.1', '>=0.2.3||<0.0.1'],
  ['||', '*'],
  ['2.x.x', '>=2.0.0 <3.0.0-0'],
  ['1.2.x', '>=1.2.0 <1.3.0-0'],
  ['1.2.x || 2.x', '>=1.2.0 <1.3.0-0||>=2.0.0 <3.0.0-0'],
  ['x', '*'],
  ['2.*.*', '>=2.0.0 <3.0.0-0'],
  ['1.2.*', '>=1.2.0 <1.3.0-0'],
  ['1.2.* || 2.*', '>=1.2.0 <1.3.0-0||>=2.0.0 <3.0.0-0'],
  ['2', '>=2.0.0 <3.0.0-0'],
  ['2.3', '>=2.3.0 <2.4.0-0'],
  ['~2.4', '>=2.4.0 <2.5.0-0'],
  ['~>3.2.1', '>=3.2.1 <3.3.0-0'],
  ['~1', '>=1.0.0 <2.0.0-0'],
  ['~>1', '>=1.0.0 <2.0.0-0'],
  ['~> 1', '>=1.0.0 <2.0.0-0'],
  ['~1.0', '>=1.0.0 <1.1.0-0'],
  ['~ 1.0', '>=1.0.0 <1.1.0-0'],
  ['^0', '<1.0.0-0'],
  ['^ 1', '>=1.0.0 <2.0.0-0'],
  ['^0.1', '>=0.1.0 <0.2.0-0'],
  ['^1.0', '>=1.0.0 <2.0.0-0'],
  ['^1.2', '>=1.2.0 <2.0.0-0'],
  ['^0.0.1', '>=0.0.1 <0.0.2-0'],
  ['^0.0.1-beta', '>=0.0.1-beta <0.0.2-0'],
  ['^0.1.2', '>=0.1.2 <0.2.0-0'],
  ['^1.2.3', '>=1.2.3 <2.0.0-0'],
  ['^1.2.3-beta.4', '>=1.2.3-beta.4 <2.0.0-0'],
  ['<1', '<1.0.0-0'],
  ['< 1', '<1.0.0-0'],
  ['>=1', '>=1.0.0'],
  ['>= 1', '>=1.0.0'],
  ['<1.2', '<1.2.0-0'],
  ['< 1.2', '<1.2.0-0'],
  ['>01.02.03', '>1.2.3', true],
  ['>01.02.03', null],
  ['~1.2.3beta', '>=1.2.3-beta <1.3.0-0', { loose: true }],
  ['~1.2.3beta', null],
  ['^ 1.2 ^ 1', '>=1.2.0 <2.0.0-0 >=1.0.0'],
  ['1.2 - 3.4.5', '>=1.2.0 <=3.4.5'],
  ['1.2.3 - 3.4', '>=1.2.3 <3.5.0-0'],
  ['1.2 - 3.4', '>=1.2.0 <3.5.0-0'],
  ['>1', '>=2.0.0'],
  ['>1.2', '>=1.3.0'],
  ['>X', '<0.0.0-0'],
  ['<X', '<0.0.0-0'],
  ['<x <* || >* 2.x', '<0.0.0-0'],
  ['>x 2.x || * || <x', '*'],
  ['>=09090', null],
  ['>=09090', '>=9090.0.0', true],
  ['>=09090-0', null, { includePrerelease: true }],
  ['>=09090-0', null, { loose: true, includePrerelease: true }],
  [`^${MAX_SAFE_INTEGER}.0.0`, null],
  [`=${MAX_SAFE_INTEGER}.0.0`, `${MAX_SAFE_INTEGER}.0.0`],
  [`^${MAX_SAFE_INTEGER - 1}.0.0`, `>=${MAX_SAFE_INTEGER - 1}.0.0 <${MAX_SAFE_INTEGER}.0.0-0`],
  ['> vv1.0', null],
  ['> v=vv==  1.0', null],
  ['> vv1.0', null, { loose: true }],
  ['> v=vv==  1.0', null, { loose: true }],
]
