var test = require('tap').test
var exec = require('child_process').exec

test('the command line using pipes or arguments produces the same output', function (t) {
  t.plan(6);
  var bin = 'node ./bin/semver ';
  [[bin+'-i 1.0.0', 'echo 1.0.0 | '+bin+'-i'],
    [bin+'-i major 1.0.0', 'echo 1.0.0 | '+bin+'-i major'],
    [bin+'-i prerelease 1.0.0', 'echo 1.0.0 | '+bin+'-i prerelease'],
    [bin+'-i preminor 1.0.0', 'echo 1.0.0 | '+bin+'-i preminor'],
    [bin+'-i prepatch --preid alpha 1.0.0', 'echo 1.0.0 | '+bin+'-i prepatch --preid alpha'],
    [bin+'-r \\>1.0.0 0.8.0 1.1.1', 'echo 0.8.0 1.1.1 | '+bin+'-r \\>1.0.0']
  ].forEach(function(tab) {
    exec(tab[0], function(error, stdout, stderr) {
      var resCli = stdout + stderr;
      exec(tab[1], function(error, stdout, stderr) {
        var resPipe = stdout + stderr;
        t.assert(resCli === resPipe);
      });
    });
  });
})
