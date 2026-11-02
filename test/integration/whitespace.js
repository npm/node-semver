'use strict'

const { test } = require('tap')
const Range = require('../../classes/range')
const SemVer = require('../../classes/semver')
const Comparator = require('../../classes/comparator')
const validRange = require('../../ranges/valid')
const minVersion = require('../../ranges/min-version')
const minSatisfying = require('../../ranges/min-satisfying')
const maxSatisfying = require('../../ranges/max-satisfying')
const satisfies = require('../../functions/satisfies')

const wsMedium = ' '.repeat(125)
const wsLarge = ' '.repeat(500000)
const zeroLarge = '0'.repeat(500000)
const versionPrefixLarge = 'v'.repeat(500000)

test('range with whitespace', (t) => {
  // a range with these extra characters would take a few minutes to process if
  // any redos susceptible regexes were used. there is a global tap timeout per
  // file set in the package.json that will error if this test takes too long.
  const r = `1.2.3 ${wsLarge} <1.3.0`
  t.equal(new Range(r).range, '1.2.3 <1.3.0')
  t.equal(validRange(r), '1.2.3 <1.3.0')
  t.equal(minVersion(r).version, '1.2.3')
  t.equal(minSatisfying(['1.2.3'], r), '1.2.3')
  t.equal(maxSatisfying(['1.2.3'], r), '1.2.3')
  t.throws(() => new Range('> invalid'))
  t.end()
})

test('range with 0', (t) => {
  const r = `1.2.3 ${zeroLarge} <1.3.0`
  t.throws(() => new Range(r).range)
  t.equal(validRange(r), null)
  t.throws(() => minVersion(r).version)
  t.equal(minSatisfying(['1.2.3'], r), null)
  t.equal(maxSatisfying(['1.2.3'], r), null)
  t.end()
})

test('range with repeated version prefix', (t) => {
  t.throws(() => new Range(versionPrefixLarge))
  t.equal(validRange(versionPrefixLarge), null)
  t.equal(satisfies('1.2.3', versionPrefixLarge), false)
  t.throws(() => minVersion(versionPrefixLarge))
  t.equal(minSatisfying(['1.2.3'], versionPrefixLarge), null)
  t.equal(maxSatisfying(['1.2.3'], versionPrefixLarge), null)

  const r = `>= ${versionPrefixLarge}1`
  t.equal(new Range(r).range, '>=1.0.0')
  t.equal(validRange(r), '>=1.0.0')
  t.equal(satisfies('1.2.3', r), true)
  t.equal(minVersion(r).version, '1.0.0')
  t.equal(minSatisfying(['1.2.3'], r), '1.2.3')
  t.equal(maxSatisfying(['1.2.3'], r), '1.2.3')
  t.end()
})

test('semver version', (t) => {
  const v = `${wsMedium}1.2.3${wsMedium}`
  const tooLong = `${wsLarge}1.2.3${wsLarge}`
  t.equal(new SemVer(v).version, '1.2.3')
  t.throws(() => new SemVer(tooLong))
  t.end()
})

test('comparator', (t) => {
  const comparator = `${wsLarge}<${wsLarge}1.2.3${wsLarge}`
  t.equal(new Comparator(comparator).value, '<1.2.3')
  t.end()
})
