'use strict'

const { test } = require('tap')
const gt = require('../../functions/gt')
const comparisons = require('../fixtures/comparisons.js')
const equality = require('../fixtures/equality.js')

test('comparison tests', t => {
  t.plan(comparisons.length)
  comparisons.forEach(([v0, v1, loose]) => t.test(`${v0} ${v1} ${loose}`, t => {
    t.plan(4)
    t.ok(gt(v0, v1, loose), `gt('${v0}', '${v1}')`)
    t.ok(!gt(v1, v0, loose), `!gt('${v1}', '${v0}')`)
    t.ok(!gt(v1, v1, loose), `!gt('${v1}', '${v1}')`)
    t.ok(!gt(v0, v0, loose), `!gt('${v0}', '${v0}')`)
  }))
})

test('equality tests', t => {
  t.plan(equality.length)
  equality.forEach(([v0, v1, loose]) => t.test(`${v0} ${v1} ${loose}`, t => {
    t.plan(2)
    t.ok(!gt(v0, v1, loose), `!gt(${v0}, ${v1})`)
    t.ok(!gt(v1, v0, loose), `!gt(${v1}, ${v0})`)
  }))
})
