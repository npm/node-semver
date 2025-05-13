import { test } from '@japa/runner'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// const packagePath = path.join(__dirname, '..', '..', 'package.json')
const binPath = path.join(__dirname, '..', '..', 'bin', 'semver.js')

const run = (
  args: string[]
): Promise<{ out: string; err: string; code: number | null; signal: NodeJS.Signals | null }> =>
  new Promise((resolve, reject) => {
    const passedArgs = [binPath]
    if (args.length > 0) {
      passedArgs.push(...args)
    }
    // eslint-disable-next-line no-restricted-globals
    const c = spawn(process.execPath, passedArgs)
    c.on('error', reject)
    const out: string[] = []
    const err: string[] = []
    c.stdout.setEncoding('utf-8')
    c.stdout.on('data', (chunk) => out.push(chunk))
    c.stderr.setEncoding('utf-8')
    c.stderr.on('data', (chunk) => err.push(chunk))
    c.on('close', (code, signal) => {
      resolve({
        out: out.join('').trim(),
        err: err.join('').trim(),
        code: code,
        signal: signal,
      })
    })
  })

test.group('inc tests', () => {
  test('-i major 1.0.0', async ({ assert }) => {
    const result = await run(['-i', 'major', '1.0.0'])
    assert.equal(result.out, '2.0.0')
  })

  test('-i major 1.0.0 1.0.1', async ({ assert }) => {
    const result = await run(['-i', 'major', '1.0.0', '1.0.1'])
    assert.equal(result.err, '--inc can only be used on a single version with no range')
  })

  test('-i premajor 1.0.0 --preid=beta', async ({ assert }) => {
    const result = await run(['-i', 'premajor', '1.0.0', '--preid=beta'])
    assert.equal(result.out, '2.0.0-beta.0')
  })

  test('-i premajor 1.0.0 --preid=beta -n 1', async ({ assert }) => {
    const result = await run(['-i', 'premajor', '1.0.0', '--preid=beta', '-n', '1'])
    assert.equal(result.out, '2.0.0-beta.1')
  })

  test('-i premajor 1.0.0 --preid=beta -n false', async ({ assert }) => {
    const result = await run(['-i', 'premajor', '1.0.0', '--preid=beta', '-n', 'false'])
    assert.equal(result.out, '2.0.0-beta')
  })

  test('-i 1.2.3', async ({ assert }) => {
    const result = await run(['-i', '1.2.3'])
    assert.equal(result.out, '1.2.4')
  })
})

test.group('help output', () => {
  const args: string[][] = [['-h'], ['-?'], ['--help'], []]

  test(args[0].join(' '), async ({ assert }) => {
    const result = await run(args[0])
    assert.isTrue(result.out.startsWith('SemVer'))
  })

  test(args[1].join(' '), async ({ assert }) => {
    const result = await run(args[1])
    assert.isTrue(result.out.startsWith('SemVer'))
  })

  test(args[2].join(' '), async ({ assert }) => {
    const result = await run(args[2])
    assert.isTrue(result.out.startsWith('SemVer'))
  })

  test('(no arguments)', async ({ assert }) => {
    const result = await run(args[3])
    assert.isTrue(result.out.startsWith('SemVer'))
  })
})

test.group('sorting and filtering', () => {
  const args: string[][] = [
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
  ]

  test(args[0].join(' '), async ({ assert }) => {
    const result = await run(args[0])
    assert.equal(result.out, '1.2.3\n2.3.4\n3.2.1')
  })

  test(args[1].join(' '), async ({ assert }) => {
    const result = await run(args[1])
    assert.equal(result.out, '1.2.3\n2.3.4-beta\n2.3.4\n3.2.1')
  })

  test(args[2].join(' '), async ({ assert }) => {
    const result = await run(args[2])
    assert.equal(result.out, '1.2.3\n2.3.4\n3.2.1')
  })

  test(args[3].join(' '), async ({ assert }) => {
    const result = await run(args[3])
    assert.equal(result.out, '3.2.1\n2.3.4\n1.2.3')
  })

  test(args[4].join(' '), async ({ assert }) => {
    const result = await run(args[4])
    assert.equal(result.out, '1.2.3-bar')
  })

  test(args[5].join(' '), async ({ assert }) => {
    const result = await run(args[5])
    assert.equal(result.out, '1.2.3-bar')
  })

  test(args[6].join(' '), async ({ assert }) => {
    const result = await run(args[6])
    assert.equal(result.out, '1.2.3\n2.3.4\n3.2.1')
  })
})

// const thisVersion = require('../../package.json').version
// t.cleanSnapshot = str => str.split(thisVersion).join('@@VERSION@@')

// t.test('sorting and filtering', t => Promise.all([
//   ['1.2.3', '3.2.1', '2.3.4'],
//   ['1.2.3', '3.2.1', '2.3.4', '2.3.4-beta'],
//   ['1.2.3', '-v', '3.2.1', '--version', '2.3.4'],
//   ['1.2.3', '-v', '3.2.1', '--version', '2.3.4', '-rv'],
//   ['1.2.3foo', '1.2.3-bar'],
//   ['1.2.3foo', '1.2.3-bar', '-l'],
//   ['1.2.3', '3.2.1', '-r', '2.x', '2.3.4'],
//   ['1.2.3', '3.2.1', '2.3.4', '2.3.4-beta', '2.0.0asdf', '-r', '2.x'],
//   ['1.2.3', '3.2.1', '2.3.4', '2.3.4-beta', '2.0.0asdf', '-r', '2.x', '-p'],
//   ['3.2.1', '2.3.4', '2.3.4-beta', '2.0.0asdf', '-r', '2.x', '-p', '-l'],
//   ['1.2.3', '3.2.1', '-r', '2.x'],
// ].map(args => t.resolveMatchSnapshot(run(args), args.join(' ')))))

// t.test('coercing', t => Promise.all([
//   ['1.2.3.4.5.6', '-c'],
//   ['1.2.3.4.5.6', '-c', '--rtl'],
//   ['1.2.3.4.5.6', '-c', '--rtl', '--ltr'],
//   ['not a version', '1.2.3', '-c'],
//   ['not a version', '-c'],
// ].map(args => t.resolveMatchSnapshot(run(args), args.join(' ')))))

// t.test('args with equals', t => Promise.all([
//   [['--version', '1.2.3'], '1.2.3'],
//   [['--range', '1'], ['1.2.3'], ['2.3.4'], '1.2.3'],
//   [['--increment', 'major'], ['1.0.0'], '2.0.0'],
//   [['--increment', 'premajor'], ['--preid', 'beta'], ['1.0.0'], '2.0.0-beta.0'],
// ].map(async (args) => {
//   const expected = args.pop()
//   const equals = args.map((a) => a.join('='))
//   const spaces = args.reduce((acc, a) => acc.concat(a), [])
//   const res1 = await run(equals)
//   const res2 = await run(spaces)
//   t.equal(res1.signal, null)
//   t.equal(res1.code, 0)
//   t.equal(res1.err, '')
//   t.equal(res1.out.trim(), expected)
//   t.strictSame(res1, res2, args.join(' '))
// })))
