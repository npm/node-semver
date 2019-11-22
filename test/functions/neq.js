const { test } = require('tap')
const neq = require('../../functions/neq')
const comparisons = require('../fixtures/comparisons.js')
const equality = require('../fixtures/equality.js')

test('comparison tests', t => {
  t.plan(comparisons.length)
  comparisons.forEach(([v0, v1, loose]) => t.test(`${v0} ${v1} ${loose}`, t => {
    t.plan(4)
    t.ok(neq(v0, v1, loose), `neq(${v0}, ${v1})`)
    t.ok(neq(v1, v0, loose), `neq(${v1}, ${v0})`)
    t.notOk(neq(v1, v1, loose), `!neq('${v1}', '${v1}')`)
    t.notOk(neq(v0, v0, loose), `!neq('${v0}', '${v0}')`)
  }))
})

test('equality tests', t => {
  t.plan(equality.length)
  equality.forEach(([v0, v1, loose]) => t.test(`${v0} ${v1} ${loose}`, t => {
    t.plan(4)
    t.notOk(neq(v0, v1, loose), `!neq(${v0}, ${v1})`)
    t.notOk(neq(v1, v0, loose), `!neq(${v1}, ${v0})`)
    t.notOk(neq(v0, v0, loose), `!neq(${v0}, ${v0})`)
    t.notOk(neq(v1, v1, loose), `!neq(${v1}, ${v1})`)
  }))
})
