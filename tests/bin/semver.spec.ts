import { test } from '@japa/runner'
import { spawn } from 'child_process'

const bin = new URL('../../bin/semver', import.meta.url).pathname

const run = (
  args: string[]
): Promise<{ out: string; err: string; code: number | null; signal: NodeJS.Signals | null }> =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line no-restricted-globals
    const child = spawn(process.execPath, [bin, ...args])
    const out: string[] = []
    const err: string[] = []

    child.stdout.setEncoding('utf-8')
    child.stdout.on('data', (chunk) => out.push(chunk))
    child.stderr.setEncoding('utf-8')
    child.stderr.on('data', (chunk) => err.push(chunk))
    child.on('error', reject)
    child.on('close', (code, signal) => {
      resolve({
        out: out.join('').trim(),
        err: err.join('').trim(),
        code,
        signal,
      })
    })
  })

test.group('semver CLI tests', () => {
  test('inc tests')
    .with([
      ['-i', 'major', '1.0.0'],
      ['-i', 'premajor', '1.0.0', '--preid=beta'],
      ['-i', 'premajor', '1.0.0', '--preid=beta', '-n', '1'],
      ['-i', 'premajor', '1.0.0', '--preid=beta', '-n', 'false'],
      ['-i', '1.2.3'],
    ])
    .run(async ({ assert }, args) => {
      const result = await run(args)
      assert.strictEqual(result.code, 0, `Expected exit code 0 for args: ${args.join(' ')}`)
      assert.strictEqual(result.signal, null, `Expected no signal for args: ${args.join(' ')}`)
      assert.match(result.out, /.+/, `Expected output for args: ${args.join(' ')}`)
    })

  test('-i major 1.0.0 1.0.1', async ({ assert }) => {
    const result = await run(['-i', 'major', '1.0.0', '1.0.1'])
    assert.equal(result.err, '--inc can only be used on a single version with no range')
  })

  test('help output')
    .with([['-h'], ['-?'], ['--help'], []])
    .run(async ({ assert }, args) => {
      const result = await run(args)
      assert.strictEqual(result.code, 0, `Expected exit code 0 for args: ${args.join(' ')}`)
      assert.strictEqual(result.signal, null, `Expected no signal for args: ${args.join(' ')}`)
      assert.match(result.out, /Usage:/, `Expected help output for args: ${args.join(' ')}`)
    })

  test('sorting and filtering')
    .with([
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
    ])
    .run(async ({ assert }, args) => {
      const result = await run(args)
      assert.strictEqual(result.code, 0, `Expected exit code 0 for args: ${args.join(' ')}`)
      assert.strictEqual(result.signal, null, `Expected no signal for args: ${args.join(' ')}`)
      assert.match(result.out, /.+/, `Expected output for args: ${args.join(' ')}`)
    })

  test('coercing')
    .with([
      ['1.2.3.4.5.6', '-c'],
      ['1.2.3.4.5.6', '-c', '--rtl'],
      ['1.2.3.4.5.6', '-c', '--rtl', '--ltr'],
      ['not a version', '1.2.3', '-c'],
      // ['not a version', '-c'],
    ])
    .run(async ({ assert }, args) => {
      const result = await run(args)
      assert.strictEqual(result.code, 0, `Expected exit code 0 for args: ${args.join(' ')}`)
      assert.strictEqual(result.signal, null, `Expected no signal for args: ${args.join(' ')}`)
      assert.match(result.out, /.+/, `Expected output for args: ${args.join(' ')}`)
    })

  test('args with equals')
    .with([
      [['--version', '1.2.3'], '1.2.3'],
      [['--range', '1'], ['1.2.3'], ['2.3.4'], '1.2.3'],
      [['--increment', 'major'], ['1.0.0'], '2.0.0'],
      [['--increment', 'premajor'], ['--preid', 'beta'], ['1.0.0'], '2.0.0-beta.0'],
    ] as [string[], string | string[]][])
    .run(async ({ assert }, args) => {
      const expected = args.pop()
      const equals = args.map((a) => (a as string[]).join('='))
      const spaces = (args as string[][]).reduce((acc, a) => acc.concat(a), [])
      const res1 = await run(equals)
      const res2 = await run(spaces)

      assert.strictEqual(res1.code, 0, `Expected exit code 0 for args: ${equals.join(' ')}`)
      assert.strictEqual(res1.signal, null, `Expected no signal for args: ${equals.join(' ')}`)
      assert.strictEqual(res1.err, '')
      assert.strictEqual(res1.out.trim(), expected, `Expected output "${expected}" for args: ${equals.join(' ')}`)
      assert.deepEqual(res1, res2, `Expected results to match for args: ${equals.join(' ')}`)
    })
})
