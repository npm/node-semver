const t = require('node:test')
const a = require('node:assert')

const thisVersion = require('../../package.json').version

const spawn = require('child_process').spawn
const bin = require.resolve('../../bin/semver')
const run = args => new Promise((resolve, reject) => {
  const c = spawn(process.execPath, [bin].concat(args))
  c.on('error', reject)
  const out = []
  const err = []
  c.stdout.setEncoding('utf-8')
  c.stdout.on('data', chunk => out.push(chunk.replace('\r\n', '\n')))
  c.stderr.setEncoding('utf-8')
  c.stderr.on('data', chunk => err.push(chunk.replace('\r\n', '\n')))
  c.on('close', (code, signal) => {
    resolve({
      out: out.join(''),
      err: err.join(''),
      code: code,
      signal: signal,
    })
  })
})

t.test('inc tests', async t => {
  const cmds = [
    [['-i', 'major', '1.0.0'], '2.0.0\n'],
    [['-i', 'premajor', '1.0.0', '--preid=beta'], '2.0.0-beta.0\n'],
    [['-i', 'premajor', '1.0.0', '--preid=beta', '-n', '1'], '2.0.0-beta.1\n'],
    [['-i', 'premajor', '1.0.0', '--preid=beta', '-n', 'false'], '2.0.0-beta\n'],
    [['-i', '1.2.3'], '1.2.4\n'],
  ]
  for (const [args, result] of cmds) {
    await t.test(args.join(' '), async t => {
      const { code, err, signal, out } = await run(args)
      a.equal(code, 0)
      a.equal(err, '')
      a.equal(signal, null)
      a.equal(out, result)
    })
  }
  await t.test('too many params', async t => {
    const { code, err, signal, out } = await run(['-i', 'major', '1.0.0', '1.0.1'])
    a.equal(code, 1)
    a.equal(err, '--inc can only be used on a single version with no range\n')
    a.equal(signal, null)
    a.equal(out, '')
  })
})

t.test('help output', async t => {
  const h = await run(['-h'])
  const help = await run(['--help'])
  const no = await run([])
  const q = await run(['-?'])
  a.equal(h.code, 0)
  a.equal(h.err, '')
  a.equal(h.signal, null)
  a.equal(help.code, 0)
  a.equal(help.err, '')
  a.equal(help.signal, null)
  a.equal(no.code, 0)
  a.equal(no.err, '')
  a.equal(no.signal, null)
  a.equal(q.code, 0)
  a.equal(q.err, '')
  a.equal(q.signal, null)
  a.equal(h.out, help.out)
  a.equal(h.out, q.out)
  a.equal(h.out, no.out)
  a.equal(h.out.replace(thisVersion, '@@VERSION@@'), `SemVer @@VERSION@@

A JavaScript implementation of the https://semver.org/ specification
Copyright Isaac Z. Schlueter

Usage: semver [options] <version> [<version> [...]]
Prints valid versions sorted by SemVer precedence

Options:
-r --range <range>
        Print versions that match the specified range.

-i --increment [<level>]
        Increment a version by the specified level.  Level can
        be one of: major, minor, patch, premajor, preminor,
        prepatch, or prerelease.  Default level is 'patch'.
        Only one version may be specified.

--preid <identifier>
        Identifier to be used to prefix premajor, preminor,
        prepatch or prerelease version increments.

-l --loose
        Interpret versions and ranges loosely

-p --include-prerelease
        Always include prerelease versions in range matching

-c --coerce
        Coerce a string into SemVer if possible
        (does not imply --loose)

--rtl
        Coerce version strings right to left

--ltr
        Coerce version strings left to right (default)

-n <base>
        Base number to be used for the prerelease identifier.
        Can be either 0 or 1, or false to omit the number altogether.
        Defaults to 0.

Program exits successfully if any valid version satisfies
all supplied ranges, and prints all satisfying versions.

If no satisfying versions are found, then exits failure.

Versions are printed in ascending order, so supplying
multiple versions to the utility will just sort them.
`)
})

t.test('sorting and filtering', async t => {
  const cmds = [
    [['1.2.3', '3.2.1', '2.3.4'], '1.2.3\n2.3.4\n3.2.1\n'],
    [['1.2.3', '3.2.1', '2.3.4', '2.3.4-beta'], '1.2.3\n2.3.4-beta\n2.3.4\n3.2.1\n'],
    [['1.2.3', '-v', '3.2.1', '--version', '2.3.4'], '1.2.3\n2.3.4\n3.2.1\n'],
    [['1.2.3', '-v', '3.2.1', '--version', '2.3.4', '-rv'], '3.2.1\n2.3.4\n1.2.3\n'],
    [['1.2.3foo', '1.2.3-bar'], '1.2.3-bar\n'],
    [['1.2.3foo', '1.2.3-bar', '-l'], '1.2.3-bar\n'],
    [['1.2.3', '3.2.1', '-r', '2.x', '2.3.4'], '2.3.4\n'],
    [['1.2.3', '3.2.1', '2.3.4', '2.3.4-beta', '2.0.0asdf', '-r', '2.x'], '2.3.4\n'],
    [['1.2.3', '3.2.1', '2.3.4', '2.3.4-beta', '2.0.0asdf', '-r', '2.x', '-p'],
      '2.3.4-beta\n2.3.4\n'],
    [['3.2.1', '2.3.4', '2.3.4-beta', '2.0.0asdf', '-r', '2.x', '-p', '-l'],
      '2.3.4-beta\n2.3.4\n'],
  ]
  for (const [args, result] of cmds) {
    await t.test(args.join(' '), async t => {
      const { code, err, signal, out } = await run(args)
      a.equal(code, 0)
      a.equal(err, '')
      a.equal(signal, null)
      a.equal(out, result)
    })
  }
  await t.test('nothing in range', async t => {
    const { code, err, signal, out } = await run(['1.2.3', '3.2.1', '-r', '2.x'])
    a.equal(code, 1)
    a.equal(err, '')
    a.equal(signal, null)
    a.equal(out, '')
  })
})

t.test('coercing', async t => {
  const cmds = [
    [['1.2.3.4.5.6', '-c'], '1.2.3\n'],
    [['1.2.3.4.5.6', '-c', '--rtl'], '4.5.6\n'],
    [['1.2.3.4.5.6', '-c', '--rtl', '--ltr'], '1.2.3\n'],
    [['not a version', '1.2.3', '-c'], '1.2.3\n'],
  ]
  for (const [args, result] of cmds) {
    await t.test(args.join(' '), async t => {
      const { code, err, signal, out } = await run(args)
      a.equal(code, 0)
      a.equal(err, '')
      a.equal(signal, null)
      a.equal(out, result)
    })
  }
  await t.test('not a version', async t => {
    const { code, err, signal, out } = await run(['not a version', '-c'])
    a.equal(code, 1)
    a.equal(err, '')
    a.equal(signal, null)
    a.equal(out, '')
  })
})

t.test('args with equals', async t => {
  const cmds = [
    [[['--version', '1.2.3']], '1.2.3'],
    [[['--range', '1'], ['1.2.3'], ['2.3.4']], '1.2.3'],
    [[['--increment', 'major'], ['1.0.0']], '2.0.0'],
    [[['--increment', 'premajor'], ['--preid', 'beta'], ['1.0.0']], '2.0.0-beta.0'],
  ]
  for (const [args, result] of cmds) {
    const equals = args.map(arg => arg.join('='))
    const spaces = args.reduce((acc, arg) => acc.concat(arg), [])
    const res1 = await run(equals)
    const res2 = await run(spaces)
    a.equal(res1.signal, null)
    a.equal(res1.code, 0)
    a.equal(res1.err, '')
    a.equal(res1.out.trim(), result)
    a.deepEqual(res1, res2, args.join(' '))
  }
})
