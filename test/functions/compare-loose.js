'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const compareLoose = require('../../functions/compare-loose')
const SemVer = require('../../classes/semver')
const eq = require('../../functions/eq')

test('strict vs loose version numbers', () => {
  [['=1.2.3', '1.2.3'],
    ['01.02.03', '1.2.3'],
    ['1.2.3-beta.01', '1.2.3-beta.1'],
    ['   =1.2.3', '1.2.3'],
    ['1.2.3foo', '1.2.3-foo'],
  ].forEach((v) => {
    const loose = v[0]
    const strict = v[1]
    a.throws(() => {
      SemVer(loose) // eslint-disable-line no-new
    })
    const lv = new SemVer(loose, true)
    a.equal(lv.version, strict)
    a.ok(eq(loose, strict, true))
    a.throws(() => {
      eq(loose, strict)
    })
    a.throws(() => {
      new SemVer(strict).compare(loose)
    })
    a.equal(compareLoose(v[0], v[1]), 0)
  })
})
