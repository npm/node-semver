var tap = require('tap');
var test = tap.test;
var semver = require('../semver.js');

test('\nbuild-metadata', function(t) {
  // [metadata, version]
  [
    [['alpha', '1'], '1.2.2+alpha.1'],
    [[1], '0.6.1+1'],
    [['pre'], 'v0.5.4+pre'],
    [['alpha', '1'], 'v1.2.2+alpha.1'],
    [['abc'], '0.6.1-beta+abc'],
    [[], '1.0.0'],
    [[], '2.0.0-alpha.1'],
  ].forEach(function(tuple) {
    var expected = tuple[0];
    var version = tuple[1];
    var msg = 'build metadata(' + version + ')';
    t.same(semver(version).build, expected, msg);
  });
  t.end();
});

test('\nformat', function(t) {
  parseAndPrint = function(versionString) {
    return semver(versionString).format();
  };

  [
    '0.0.0',
    '0.1.0+abc',
    '1.0.0-beta+abc',
  ].forEach(function(versionString) {
    t.same(parseAndPrint(versionString), versionString);
  });
  t.end();
});
