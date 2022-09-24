var t = require('tap');
var bin = require.resolve('../bin/semver');
var node = process.execPath;
var spawn = require('child_process').spawn;

var tests = [
  ['-i', '1.0.0'],
  ['-i major', '1.0.0'],
  ['-i prerelease', '1.0.0'],
  ['-i preminor', '1.0.0'],
  ['-i prepatch --preid alpha', '1.0.0'],
  ['-r >1.0.0', '1.0.0 0.8.0 1.1.1']
].map(function (tc) {
  return [ tc[0].split(' '), tc[1].split(' ') ]
})

t.plan(tests.length)

tests.forEach(function (testcase) {
  var args = testcase[0]
  var versions = testcase[1]
  var name = 'args=' + args.join(' ') + ', versions=' + versions.join(' ')
  t.test(name, function (t) {
    var count = 0

    var cliafter = spawn(node, [bin].concat(args).concat(versions));
    var cliafterout = ''
    cliafter.stderr.pipe(process.stderr)
    cliafter.stdout.on('data', function (c) {
      cliafterout += c
    })
    cliafter.on('close', done('cli after'))

    var clibefore = spawn(node, [bin].concat(versions).concat(args));
    var clibeforeout = ''
    clibefore.stderr.pipe(process.stderr)
    clibefore.stdout.on('data', function (c) {
      clibeforeout += c
    })
    clibefore.on('close', done('cli before'))

    var pipe = spawn(node, [bin].concat(args));
    var pipeout = ''
    pipe.stderr.pipe(process.stderr)
    pipe.on('close', done('pipe'))
    pipe.stdout.on('data', function (c) {
      pipeout += c
    })
    pipe.stdin.end(versions.join('\n'))

    function done (who) { return function (code, signal) {
      t.notOk(code, 'exit code should be falsey (' + who + ')')
      t.notOk(signal, 'exit signal should be falsey (' + who + ')')
      if (++count !== 3) return

      t.equal(cliafterout, clibeforeout, 'same output before and after')
      t.equal(pipeout, cliafterout, 'same output if versions on stdin')
      t.end()
    }}
  })
})
