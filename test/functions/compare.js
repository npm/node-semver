'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const compare = require('../../functions/compare.js')
const comparisons = require('../fixtures/comparisons.js')
const equality = require('../fixtures/equality.js')
const SemVer = require('../../classes/semver.js')

test('comparison tests', async (t) => {
  for (const [v0, v1, loose] of comparisons) {
    await t.test(`${v0} ${v1} ${loose}`, () => {
      a.equal(compare(v0, v1, loose), 1, `compare('${v0}', '${v1}')`)
      a.equal(compare(v1, v0, loose), -1, `compare('${v1}', '${v0}')`)
      a.equal(compare(v0, v0, loose), 0, `compare('${v0}', '${v0}')`)
      a.equal(compare(v1, v1, loose), 0, `compare('${v1}', '${v1}')`)
    })
  }
})

test('equality tests', async (t) => {
  // [version1, version2]
  // version1 should be equivalent to version2
  for (const [v0, v1, loose] of equality) {
    await t.test(`${v0} ${v1} ${loose}`, () => {
      a.equal(compare(v0, v1, loose), 0, `${v0} ${v1}`)
      a.equal(compare(v1, v0, loose), 0, `${v1} ${v0}`)
      a.equal(compare(v0, v0, loose), 0, `${v0} ${v0}`)
      a.equal(compare(v1, v1, loose), 0, `${v1} ${v1}`)

      // also test with an object. they are === because obj.version matches
      a.equal(compare(new SemVer(v0, { loose: loose }),
        new SemVer(v1, { loose: loose })), 0,
      `compare(${v0}, ${v1}) object`)
    })
  }
})
