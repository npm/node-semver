var tap = require('tap');
var test = tap.test;
var semver = require('../semver.js');
var coerce = semver.coerce;

test('\ncoerce tests', function(t) {
  var tooLong = '123' + '.1'.repeat(127);
  var justRight = '12' + '.1'.repeat(127);

  // Expected to be null (cannot be coerced).
  [
    null,
    {version: '1.2.3'},
    function () { return '1.2.3'; },
    '',
    '.',
    tooLong
  ].forEach(function (input) {
    var msg = 'coerce(' + input + ') should be null'
    t.same(coerce(input), null, msg)
  });

  // Expected to be the same.
  [
    [semver.parse('1.2.3'), '1.2.3'],
    ['.1', '1.0.0'],
    ['.1.', '1.0.0'],
    ['..1', '1.0.0'],
    ['.1.1', '1.1.0'],
    ['1.', '1.0.0'],
    ['1.0', '1.0.0'],
    ['1.0.0', '1.0.0'],
    ['0', '0.0.0'],
    ['0.0', '0.0.0'],
    ['0.0.0', '0.0.0'],
    ['0.1', '0.1.0'],
    ['0.0.1', '0.0.1'],
    ['0.1.1', '0.1.1'],
    ['1', '1.0.0'],
    ['1.2', '1.2.0'],
    ['1.2.3', '1.2.3'],
    ['1.2.3.4', '1.2.3'],
    ['13', '13.0.0'],
    ['35.12', '35.12.0'],
    ['35.12.18', '35.12.18'],
    ['35.12.18.24', '35.12.18'],
    ['v1', '1.0.0'],
    ['v1.2', '1.2.0'],
    ['v1.2.3', '1.2.3'],
    ['v1.2.3.4', '1.2.3'],
    ['1 0', '1.0.0'],
    ['1 1', '1.0.0'],
    ['1.1 1', '1.1.0'],
    ['1.1-1', '1.1.0'],
    ['1.1-1', '1.1.0'],
    ['a1', '1.0.0'],
    ['a1a', '1.0.0'],
    ['1a', '1.0.0'],
    ['version 1', '1.0.0'],
    ['version1', '1.0.0'],
    ['version1.0', '1.0.0'],
    ['version1.1', '1.1.0'],
    [justRight, '12.1.1']
  ].forEach(function (tuple) {
    var input = tuple[0]
    var expected = tuple[1]
    var msg = 'coerce(' + input + ') should become ' + expected
    t.same((coerce(input) || {}).version, expected, msg)
  });

  t.done();
});