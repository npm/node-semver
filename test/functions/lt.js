const { test } = require('tap')
const lt = require('../../functions/lt')
const comparisons = require('../fixtures/comparisons.js')
const equality = require('../fixtures/equality.js')

test('comparison tests', t => {
  t.plan(comparisons.length)
  comparisons.forEach(([v0, v1, loose]) => t.test(`${v0} ${v1} ${loose}`, t => {
    t.plan(4)
    t.ok(!lt(v0, v1, loose), `!lt('${v0}', '${v1}')`)
    t.ok(lt(v1, v0, loose), `lt('${v1}', '${v0}')`)
    t.ok(!lt(v1, v1, loose), `!lt('${v1}', '${v1}')`)
    t.ok(!lt(v0, v0, loose), `!lt('${v0}', '${v0}')`)
  }))
})

test('equality tests', t => {
  t.plan(equality.length)
  equality.forEach(([v0, v1, loose]) => t.test(`${v0} ${v1} ${loose}`, t => {
    t.plan(2)
    t.ok(!lt(v0, v1, loose), `!lt(${v0}, ${v1})`)
    t.ok(!lt(v1, v0, loose), `!lt(${v1}, ${v0})`)
  }))
})
