var tap = require('tap');
var test = tap.test;
var semver = require('../semver.js');
var pad = semver.pad;
var clean = semver.pad;

test('\npad tests', function(t) {
	[
		['1.2.3', '1.2.3'],
		['1.2', '1.2.0'],
		['1', '1.0.0'],
	].forEach(function(tuple) {
			var range = tuple[0];
			var version = tuple[1];
			var msg = 'clean(' + range + ') = ' + version;
			t.equal(pad(range), version, msg);
		});
	t.end();
});
