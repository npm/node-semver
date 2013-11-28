var tap = require('tap');
var test = tap.test;
var semver = require('../semver.js');
var clean = semver.clean;

test('\nclean tests', function(t) {
	// [range, version]
	// Version should be detectable despite extra characters
	[
		['1', '1.0.0'],
		['1.2', '1.2.0'],
		['1.2.3', '1.2.3'],
		['~1.2.3', '1.2.3'],
		['~1.2.3-4', '1.2.3-4'],
		['~v1.2.3-4', '1.2.3-4'],
		['~v1.2.3-pre', '1.2.3-pre'],
		['<1.2.3', '1.2.3'],
		['<=1.2.3', '1.2.3'],
		['>1.2.3', '1.2.3'],
		['>=1.2.3', '1.2.3'],
		['~>1', '1.0.0'],
		['2.0.0beta', '2.0.0beta'],
		['~2.0.0beta', '2.0.0beta'],
		['>= 1.2.3', '1.2.3'],
		['>=  1.2.3', '1.2.3'],
		['>=   1.2.3', '1.2.3'],
		['> 1.2.3', '1.2.3'],
		['>  1.2.3', '1.2.3'],
		['<=   1.2.3', '1.2.3'],
		['<    1.2.3', '1.2.3'],
		['<\t1.2.3', '1.2.3'],
		['1.x.x', '1.x.x'],
		['1.2.x', '1.2.x'],
		['1.*.*', '1.*.*'],
		['1.2.*', '1.2.*']
	].forEach(function(tuple) {
			var range = tuple[0];
			var version = tuple[1];
			var msg = 'clean(' + range + ') != ' + version;
			t.equal(clean(range), version, msg);
		});
	t.end();
});
