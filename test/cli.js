var tap = require('tap');
var test = tap.test;
var execSync = require('child_process').execSync;

test('\nCLI (bin/semver) tests', function(t) {
  // [args, expected stdout, expected stderr, expected error code]
  [
    ["-i major 1.0.0", "2.0.0"],
    ["-i major 1.0.0 1.0.1", null, "--inc can only be used on a single version with no range", 1]
  ].forEach(function (input) {
    
    var expectedStdout = input[1];
    
    try {
      stdout = execSync('"./bin/semver" ' + input[0]);
      if (expectedStdout) {
        t.same(stdout.toString().trim(), expectedStdout);
      }
    } catch (err) {
      var expectedStderr = input[2];
      var expectedStatusCode = input[3];
      if (expectedStatusCode) {
        t.same(err.stderr.toString().trim(), expectedStderr);
        t.same(err.status, expectedStatusCode);
      }
    }

  });
  t.done();
});
