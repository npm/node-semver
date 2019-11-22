'use strict'
const t = require('tap')

const thisVersion = require('../../package.json').version
t.cleanSnapshot = str => str.split(thisVersion).join('@@VERSION@@')

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
      signal: signal
    })
  })
})

t.test('inc tests', t => Promise.all([
  ['-i', 'major', '1.0.0'],
  ['-i', 'major', '1.0.0', '1.0.1'],
  ['-i', 'premajor', '1.0.0', '--preid=beta'],
  ['-i', '1.2.3']
].map(args => t.resolveMatchSnapshot(run(args), args.join(' ')))))

t.test('help output', t => Promise.all([
  ['-h'],
  ['-?'],
  ['--help'],
  []
].map(h => t.resolveMatchSnapshot(run(h), h[0] || '(no args)'))))

t.test('sorting and filtering', t => Promise.all([
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
  ['1.2.3', '3.2.1', '-r', '2.x']
].map(args => t.resolveMatchSnapshot(run(args), args.join(' ')))))

t.test('coercing', t => Promise.all([
  ['1.2.3.4.5.6', '-c'],
  ['1.2.3.4.5.6', '-c', '--rtl'],
  ['1.2.3.4.5.6', '-c', '--rtl', '--ltr'],
  ['not a version', '1.2.3', '-c'],
  ['not a version', '-c']
].map(args => t.resolveMatchSnapshot(run(args), args.join(' ')))))
