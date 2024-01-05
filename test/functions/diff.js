const t = require('node:test')
const a = require('node:assert')

const diff = require('../../functions/diff')

const toDiff = require('../fixtures/diff')

t.test('diff versions test', (t) => {
  for (const [version1, version2, wanted] of toDiff) {
    a.equal(
      diff(version1, version2),
      wanted,
      `diff(${version1}, ${version2}) === ${wanted}`
    )
  }
})

t.test('throws on bad version', (t) => {
  a.throws(() => {
    diff('bad', '1.2.3')
  }, {
    message: 'Invalid Version: bad',
    name: 'TypeError',
  })
})
