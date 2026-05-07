'use strict'

const { test } = require('tap')
const truncate = require('../../functions/truncate')
const parse = require('../../functions/parse')
const truncations = require('../fixtures/truncations.js')
const validVersions = require('../fixtures/valid-versions.js')

// Freezing SemVer object inputs to truncate ensures that the truncate function
// does not mutate them
const parseAndFreezeSemVerObject = (version) => {
  const parsed = parse(version)
  Object.freeze(parsed)
  return parsed
}

test('truncate fixture versions test', (t) => {
  truncations.forEach(([pre, truncation, expected]) => {
    const actual = truncate(pre, truncation)
    const cmd = `truncate(${pre}, ${truncation})`
    t.equal(actual, expected, `${cmd} === ${expected}`)

    const parsed = parseAndFreezeSemVerObject(pre)
    const semverTruncated = truncate(parsed, truncation)
    t.equal(semverTruncated, expected, `${cmd} works on Semver object inputs`)
  })

  t.end()
})

test('truncate pre* only removes build info', (t) => {
  ['prerelease', 'prepatch', 'preminor', 'premajor'].forEach(what => {
    validVersions.forEach((v) => {
      const versionToTruncate = v[0]
      const parsed = parseAndFreezeSemVerObject(versionToTruncate)
      const expected = parsed.version
      const actual = truncate(versionToTruncate, what)

      const cmd = `truncate(${versionToTruncate}, ${what})`
      t.equal(actual, expected, `${cmd} === ${expected}`)
      t.same(parse(actual).build, [], `${cmd} build info should be removed`)
    })
  })
  t.end()
})
