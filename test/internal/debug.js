const main = () => {
  const t = require('tap')
  const {spawn} = require('child_process')
  t.plan(2)
  t.test('without env set', t => {
    const c = spawn(process.execPath, [__filename, 'child'], {env: {
      ...process.env,
      NODE_DEBUG: ''
    }})
    const err = []
    c.stderr.on('data', chunk => err.push(chunk))
    c.on('close', (code, signal) => {
      t.equal(code, 0, 'success exit status')
      t.equal(signal, null, 'no signal')
      t.equal(Buffer.concat(err).toString('utf8'), '', 'got no output')
      t.end()
    })
  })
  t.test('with env set', t => {
    const c = spawn(process.execPath, [__filename, 'child'], {env: {
      ...process.env,
      NODE_DEBUG: 'semver'
    }})
    const err = []
    c.stderr.on('data', chunk => err.push(chunk))
    c.on('close', (code, signal) => {
      t.equal(code, 0, 'success exit status')
      t.equal(signal, null, 'no signal')
      t.equal(Buffer.concat(err).toString('utf8'), 'SEMVER hello, world\n', 'got expected output')
      t.end()
    })
  })
  t.end()
}

if (process.argv[2] === 'child') { require('../../internal/debug')('hello, world') } else { main() }
