'use strict'

const { test } = require('tap')
const truncate = require('../../functions/truncate')
const parse = require('../../functions/parse')
const truncations = require('../fixtures/truncations.js')

test('truncate versions test', (t) => {
  truncations.forEach(([pre, what, wanted, options, id, base]) => {
    const found = truncate(pre, what, options, id, base)
    const cmd = `truncate(${pre}, ${what}, ${options}, ${id}, ${base})`
    t.equal(found, wanted, `${cmd} === ${wanted}`)

    const parsed = parse(pre, options)
    const semverTruncated = truncate(parsed, what, options)
    t.equal(semverTruncated, wanted, `${cmd} works on Semver objects`)
  })

  t.end()
})
