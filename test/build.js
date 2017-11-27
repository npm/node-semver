var tap = require('tap');
var test = tap.test;
var semver = require('../semver.js');
var build = semver.build;

test('\nbuild', function(t) {
  // [prereleaseParts, version, loose]
  [
    [['72f65c0413ec20bf11a'], '0.6.1-alpha.1+72f65c0413ec20bf11a'],
    [['build', '72f65c0413ec20bf11a'], '1.2.2-beta.1+build.72f65c0413ec20bf11a'],
    [['72f65c0413ec20bf11a'], '1.2.2+72f65c0413ec20bf11a'],
    [null, '1.2.2'],
    [null, '1.2.2-alpha.1']
  ].forEach(function(tuple) {
    var expected = tuple[0];
    var version = tuple[1];
    var loose = tuple[2];
    var msg = 'build(' + version + ')';
    t.same(build(version, loose), expected, msg);
  });
  t.end();
});
