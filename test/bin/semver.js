'use strict'

const { test } = require('node:test')
const a = require('node:assert')

const thisVersion = require('../../package.json').version
const cleanSnapshot = str => str.split(thisVersion).join('@@VERSION@@')

const spawn = require('child_process').spawn
const bin = require.resolve('../../bin/semver')
const run = args => new Promise((resolve, reject) => {
  const c = spawn(process.execPath, [bin].concat(args))
  c.on('error', reject)
  const out = []
  const err = []
  c.stdout.setEncoding('utf-8')
  c.stdout.on('data', chunk => out.push(chunk))
  c.stderr.setEncoding('utf-8')
  c.stderr.on('data', chunk => err.push(chunk))
  c.on('close', (code, signal) => {
    resolve({
      out: out.join(''),
      err: err.join(''),
      code: code,
      signal: signal,
    })
  })
})

test('inc tests', async (t) => {
  for (const args of [
    ['-i', 'major', '1.0.0'],
    ['-i', 'major', '1.0.0', '1.0.1'],
    ['-i', 'premajor', '1.0.0', '--preid=beta'],
    ['-i', 'premajor', '1.0.0', '--preid=beta', '-n', '1'],
    ['-i', 'premajor', '1.0.0', '--preid=beta', '-n', 'false'],
    ['-i', '1.2.3'],
  ]) {
    const result = await run(args)
    const cleaned = cleanSnapshot(JSON.stringify(result, null, 2))
    await t.test(args.join(' '), () => {
      t.assert.snapshot(cleaned)
    })
  }
})

test('help output', async (t) => {
  for (const h of [
    ['-h'],
    ['-?'],
    ['--help'],
    [],
  ]) {
    const result = await run(h)
    const cleaned = cleanSnapshot(JSON.stringify(result, null, 2))
    await t.test(h[0] || '(no args)', () => {
      t.assert.snapshot(cleaned)
    })
  }
})

test('sorting and filtering', async (t) => {
  for (const args of [
    ['1.2.3', '3.2.1', '2.3.4'],
    ['1.2.3', '3.2.1', '2.3.4', '2.3.4-beta'],
    ['1.2.3', '-v', '3.2.1', '--version', '2.3.4'],
    ['1.2.3', '-v', '3.2.1', '--version', '2.3.4', '-rv'],
    ['1.2.3foo', '1.2.3-bar'],
    ['1.2.3foo', '1.2.3-bar', '-l'],
    ['1.2.3', '3.2.1', '-r', '2.x', '2.3.4'],
    ['1.2.3', '3.2.1', '2.3.4', '2.3.4-beta', '2.0.0asdf', '-r', '2.x'],
    ['1.2.3', '3.2.1', '2.3.4', '2.3.4-beta', '2.0.0asdf', '-r', '2.x', '-p'],
    ['3.2.1', '2.3.4', '2.3.4-beta', '2.0.0asdf', '-r', '2.x', '-p', '-l'],
    ['1.2.3', '3.2.1', '-r', '2.x'],
  ]) {
    const result = await run(args)
    const cleaned = cleanSnapshot(JSON.stringify(result, null, 2))
    await t.test(args.join(' '), () => {
      t.assert.snapshot(cleaned)
    })
  }
})

test('coercing', async (t) => {
  for (const args of [
    ['1.2.3.4.5.6', '-c'],
    ['1.2.3.4.5.6', '-c', '--rtl'],
    ['1.2.3.4.5.6', '-c', '--rtl', '--ltr'],
    ['not a version', '1.2.3', '-c'],
    ['not a version', '-c'],
  ]) {
    const result = await run(args)
    const cleaned = cleanSnapshot(JSON.stringify(result, null, 2))
    await t.test(args.join(' '), () => {
      t.assert.snapshot(cleaned)
    })
  }
})

test('args with equals', async () => {
  const cases = [
    [['--version', '1.2.3'], '1.2.3'],
    [['--range', '1'], ['1.2.3'], ['2.3.4'], '1.2.3'],
    [['--increment', 'major'], ['1.0.0'], '2.0.0'],
    [['--increment', 'premajor'], ['--preid', 'beta'], ['1.0.0'], '2.0.0-beta.0'],
  ]

  for (const args of cases) {
    const expected = args.pop()
    const equals = args.map((arg) => arg.join('='))
    const spaces = args.reduce((acc, arg) => acc.concat(arg), [])
    const res1 = await run(equals)
    const res2 = await run(spaces)
    a.equal(res1.signal, null)
    a.equal(res1.code, 0)
    a.equal(res1.err, '')
    a.equal(res1.out.trim(), expected)
    a.deepEqual(res1, res2, args.join(' '))
  }
})
