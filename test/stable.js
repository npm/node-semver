var tap = require('tap');
var test = tap.test;
var semver = require('../semver.js');
var ltr = semver.ltr;


test('\nmax satisfying', function(t) {
  [
   [['1.2.3', '1.2.4-alpha'], '1.2', '1.2.4-alpha', undefined],
   [['1.2.3', '1.2.4-alpha'], '1.2', '1.2.3', undefined, true],
   [['1.2.4-beta', '1.2.3'], '1.2', '1.2.4-beta', undefined],
   [['1.2.4-beta', '1.2.3'], '1.2', '1.2.3', undefined, true],
   [['1.2.3', '1.2.4', '1.2.5', '1.2.6-0'], '~1.2.3', '1.2.6-0', undefined],
   [['1.2.3', '1.2.4', '1.2.5', '1.2.6-0'], '~1.2.3', '1.2.5', undefined, true],
   [['1.2.3', '1.2.4', '1.2.5', '1.2.6-0', '2.0.0-rc', '2.0.0', '2.1.0-rc'], '*', '2.1.0-rc', undefined],
   [['1.2.3', '1.2.4', '1.2.5', '1.2.6-0', '2.0.0-rc', '2.0.0', '2.1.0-rc'], '*', '2.0.0', undefined, true]
  ].forEach(function(v) {
      var versions = v[0];
      var range = v[1];
      var expect = v[2];
      var loose = v[3];
      var stableOnly = v[4];
      var actual = semver.maxSatisfying(versions, range, loose, stableOnly);
      t.equal(actual, expect);
    });
  t.end();
});
