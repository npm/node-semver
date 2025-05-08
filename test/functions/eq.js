'use strict'

const { test } = require('tap')
const eq = require('../../functions/eq')
const comparisons = require('../fixtures/comparisons.js')
const equality = require('../fixtures/equality.js')

test('comparison tests', t => {
  t.plan(comparisons.length)
  comparisons.forEach(([v0, v1, loose]) => t.test(`${v0} ${v1} ${loose}`, t => {
    t.plan(4)
    t.notOk(eq(v0, v1, loose), `!eq(${v0}, ${v1})`)
    t.notOk(eq(v1, v0, loose), `!eq(${v1}, ${v0})`)
    t.ok(eq(v1, v1, loose), `eq('${v1}', '${v1}')`)
    t.ok(eq(v0, v0, loose), `eq('${v0}', '${v0}')`)
  }))
})

test('equality tests', t => {
  t.plan(equality.length)
  equality.forEach(([v0, v1, loose]) => t.test(`${v0} ${v1} ${loose}`, t => {
    t.plan(4)
    t.ok(eq(v0, v1, loose), `eq(${v0}, ${v1})`)
    t.ok(eq(v1, v0, loose), `eq(${v1}, ${v0})`)
    t.ok(eq(v0, v0, loose), `eq(${v0}, ${v0})`)
    t.ok(eq(v1, v1, loose), `eq(${v1}, ${v1})`)
  }))
})
