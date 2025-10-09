'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const gte = require('../../functions/gte')
const comparisons = require('../fixtures/comparisons.js')
const equality = require('../fixtures/equality.js')

test('comparison tests', async (t) => {
  for (const [v0, v1, loose] of comparisons) {
    await t.test(`${v0} ${v1} ${loose}`, () => {
      a.ok(gte(v0, v1, loose), `gte('${v0}', '${v1}')`)
      a.ok(!gte(v1, v0, loose), `!gte('${v1}', '${v0}')`)
      a.ok(gte(v1, v1, loose), `gte('${v1}', '${v1}')`)
      a.ok(gte(v0, v0, loose), `gte('${v0}', '${v0}')`)
    })
  }
})

test('equality tests', async (t) => {
  for (const [v0, v1, loose] of equality) {
    await t.test(`${v0} ${v1} ${loose}`, () => {
      a.ok(gte(v0, v1, loose), `gte(${v0}, ${v1})`)
      a.ok(gte(v1, v0, loose), `gte(${v1}, ${v0})`)
    })
  }
})
