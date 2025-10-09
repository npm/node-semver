'use strict'

const main = async () => {
  const t = require('node:test')
  const a = require('node:assert')
  const { spawn } = require('child_process')
  await t.test('without env set', () => {
    return new Promise((resolve) => {
      const c = spawn(process.execPath, [__filename, 'child'], { env: {
        ...process.env,
        NODE_DEBUG: '',
      } })
      const err = []
      c.stderr.on('data', chunk => err.push(chunk))
      c.on('close', (code, signal) => {
        a.equal(code, 0, 'success exit status')
        a.equal(signal, null, 'no signal')
        a.equal(Buffer.concat(err).toString('utf8'), '', 'got no output')
        resolve()
      })
    })
  })
  await t.test('with env set', () => {
    return new Promise((resolve) => {
      const c = spawn(process.execPath, [__filename, 'child'], { env: {
        ...process.env,
        NODE_DEBUG: 'semver',
      } })
      const err = []
      c.stderr.on('data', chunk => err.push(chunk))
      c.on('close', (code, signal) => {
        a.equal(code, 0, 'success exit status')
        a.equal(signal, null, 'no signal')
        a.equal(Buffer.concat(err).toString('utf8'), 'SEMVER hello, world\n', 'got expected output')
        resolve()
      })
    })
  })
}

if (process.argv[2] === 'child') {
  require('../../internal/debug')('hello, world')
} else {
  main()
}
