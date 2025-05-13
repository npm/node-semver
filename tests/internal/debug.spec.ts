/* eslint-disable no-restricted-globals */
import { test } from '@japa/runner'
import { spawn } from 'child_process'

const childLocation = new URL('../fixtures/debug-child.ts', import.meta.url).pathname
const baseArgs = ['--import', 'ts-node-maintained/register/esm', '--enable-source-maps']

async function untilClose(
  child: ReturnType<typeof spawn>
): Promise<{ err: string; code: number | null; signal: NodeJS.Signals | null }> {
  const err: Buffer[] = []
  child.stderr!.on('data', (chunk) => err.push(chunk))
  return new Promise<{ err: string; code: number | null; signal: NodeJS.Signals | null }>((resolve) => {
    child.on('close', (code, signal) => {
      resolve({
        err: Buffer.concat(err).toString('utf8'),
        code,
        signal,
      })
    })
  })
}

test.group('debug function tests', () => {
  test('without NODE_DEBUG set').run(async ({ assert }) => {
    const child = spawn(process.execPath, [...baseArgs, childLocation, 'child'], {
      env: { ...process.env, NODE_DEBUG: '' },
    })
    const result = await untilClose(child)
    assert.strictEqual(result.code, 0, 'success exit status')
    assert.isNull(result.signal, 'no signal')
    assert.strictEqual(result.err, '', 'got no output')
  })

  test('with NODE_DEBUG set').run(async ({ assert }) => {
    const child = spawn(process.execPath, [...baseArgs, childLocation, 'child'], {
      env: { ...process.env, NODE_DEBUG: 'semver' },
    })

    const result = await untilClose(child)
    assert.strictEqual(result.code, 0, 'success exit status')
    assert.isNull(result.signal, 'no signal')
    assert.strictEqual(result.err, 'SEMVER hello, world\n', 'got expected output')
  })
})
