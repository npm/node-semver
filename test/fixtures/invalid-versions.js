// none of these are semvers
// [value, reason, opt]
const {MAX_LENGTH, MAX_SAFE_INTEGER} = require('../../internal/constants')
module.exports = [
  [ new Array(MAX_LENGTH).join('1') + '.0.0', 'too long'],
  [ `${MAX_SAFE_INTEGER}0.0.0`, 'too big'],
  [ `0.${MAX_SAFE_INTEGER}0.0`, 'too big'],
  [ `0.0.${MAX_SAFE_INTEGER}0`, 'too big'],
  [ 'hello, world', 'not a version'],
  [ 'hello, world', true, 'even loose, its still junk'],
  [ 'xyz', 'even loose as an opt, same', , { loose: true }],
  [ /a regexp/, 'regexp is not a string'],
  [ /1.2.3/, 'semver-ish regexp is not a string'],
  [ {toString: () => '1.2.3'}, 'obj with a tostring is not a string'],
]
