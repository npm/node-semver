var tap = require('tap');
var test = tap.test;
var semver = require('../semver.js');
var truncate = semver.truncate;

test('\truncate versions test', function(t) {
//  [version, release, result]
//  truncate(version, release) -> result
  [['1.2.3', 'major', '1.0.0'],
    ['1.2.3', 'minor', '1.2.0'],
    ['1.2.3', 'patch', '1.2.3'],
    ['1.2.3tag', 'major', '1.0.0', true],
    ['1.2.3tag', 'minor', '1.2.0', true],
    ['1.2.3tag', 'patch', '1.2.3', true],
    ['1.2.3-tag', 'major', '1.0.0'],
    ['1.2.3', 'fake', null],
    ['1.2.0-0', 'patch', '1.2.0'],
    ['fake', 'major', null],
    ['1.2.3-4', 'major', '1.0.0'],
    ['1.2.3-4', 'minor', '1.2.0'],
    ['1.2.3-4', 'patch', '1.2.3'],
    ['1.2.3-alpha.0.beta', 'major', '1.0.0'],
    ['1.2.3-alpha.0.beta', 'minor', '1.2.0'],
    ['1.2.3-alpha.0.beta', 'patch', '1.2.3'],
    ['1.2.0-1', 'minor', '1.2.0'],
    ['1.0.0-1', 'major', '1.0.0'],

  ].forEach(function(v) {
    var pre = v[0];
    var what = v[1];
    var wanted = v[2];
    var loose = v[3];
    var found = truncate(pre, what, loose);
    var cmd = 'truncate(' + pre + ', ' + what + ')';
    t.equal(found, wanted, cmd + ' === ' + wanted);

    var parsed = semver.parse(pre, loose);
    if (wanted) {
      parsed.truncate(what);
      t.equal(parsed.version, wanted, cmd + ' object version truncated');
      t.equal(parsed.raw, wanted, cmd + ' object raw field truncated');
    } else if (parsed) {
      t.throws(function () {
        parsed.truncate(what)
      })
    } else {
      t.equal(parsed, null)
    }
  });

  t.end();
});
