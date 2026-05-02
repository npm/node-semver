'use strict'

const { test } = require('tap')
const truncate = require('../../functions/truncate')
const parse = require('../../functions/parse')
const truncations = require('../fixtures/truncations.js')
const validVersions = require('../fixtures/valid-versions.js')

test('truncate fixture versions test', (t) => {
  truncations.forEach(([pre, truncation, expected, options, id, base]) => {
    const actual = truncate(pre, truncation, options, id, base)
    const cmd = `truncate(${pre}, ${truncation}, ${options}, ${id}, ${base})`
    t.equal(actual, expected, `${cmd} === ${expected}`)

    const parsed = parse(pre, options)
    const semverTruncated = truncate(parsed, truncation, options)
    t.equal(semverTruncated, expected, `${cmd} works on Semver objects`)
  })

  t.end()
})

test('truncate pre* only removes build info', (t) => {
  ['prerelease', 'prepatch', 'preminor', 'premajor'].forEach(what => {
    validVersions.forEach((v) => {
      const versionToTruncate = v[0]
      const parsed = parse(versionToTruncate)
      const expected = parsed.version
      const actual = truncate(versionToTruncate, what)

      const cmd = `truncate(${versionToTruncate}, ${what})`
      t.equal(actual, expected, `${cmd} === ${expected}`)
      t.same(parse(actual).build, [], `${cmd} strips build info `)
    })
  })
  t.end()
})
