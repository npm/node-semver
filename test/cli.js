var test = require('tap').test
var execSync = require('child_process').execSync

test('the command line using pipes or arguments produces the same output', function (t) {
  var exec = 'node ./bin/semver ';
  [[exec+'-i 1.0.0', 'echo 1.0.0 | '+exec+'-i'],
    [exec+'-i major 1.0.0', 'echo 1.0.0 | '+exec+'-i major'],
    [exec+'-i prerelease 1.0.0', 'echo 1.0.0 | '+exec+'-i prerelease'],
    [exec+'-i preminor 1.0.0', 'echo 1.0.0 | '+exec+'-i preminor'],
    [exec+'-i prepatch --preid alpha 1.0.0', 'echo 1.0.0 | '+exec+'-i prepatch --preid alpha'],
    [exec+'-r \\>1.0.0 0.8.0 1.1.1', 'echo 0.8.0 1.1.1 | '+exec+'-r \\>1.0.0']
  ].forEach(function(tab) {
    var resCli = execSync(tab[0]);
    var resPipe = execSync(tab[1]);
    t.assert(resCli.equals(resPipe));
  });
  t.end()
})
