const t = require('node:test')
const a = require('node:assert')

const { compareIdentifiers, rcompareIdentifiers } = require('../../internal/identifiers')

t.test('rcompareIdentifiers and compareIdentifiers', (t) => {
  const set = [
    ['1', '2'],
    ['alpha', 'beta'],
    ['0', 'beta'],
  ]
  for (const [x, y] of set) {
    a.equal(compareIdentifiers(x, y), -1)
    a.equal(rcompareIdentifiers(x, y), 1)
  }
  a.equal(compareIdentifiers('0', '0'), 0)
  a.equal(rcompareIdentifiers('0', '0'), 0)
})
