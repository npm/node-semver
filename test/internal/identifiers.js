const { test } = require('tap')
const { compareIdentifiers, rcompareIdentifiers } = require('../../internal/identifiers')

test('rcompareIdentifiers and compareIdentifiers', (t) => {
  const set = [
    ['1', '2'],
    ['alpha', 'beta'],
    ['0', 'beta']
  ]
  set.forEach((ab) => {
    const a = ab[0]
    const b = ab[1]
    t.equal(compareIdentifiers(a, b), -1)
    t.equal(rcompareIdentifiers(a, b), 1)
  })
  t.equal(compareIdentifiers('0', '0'), 0)
  t.equal(rcompareIdentifiers('0', '0'), 0)
  t.end()
})
