'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const Range = require('../../classes/range')
const SemVer = require('../../classes/semver')
const Comparator = require('../../classes/comparator')
const validRange = require('../../ranges/valid')
const minVersion = require('../../ranges/min-version')
const minSatisfying = require('../../ranges/min-satisfying')
const maxSatisfying = require('../../ranges/max-satisfying')

const wsMedium = ' '.repeat(125)
const wsLarge = ' '.repeat(500000)
const zeroLarge = '0'.repeat(500000)

test('range with whitespace', () => {
  // a range with these extra characters would take a few minutes to process if
  // any redos susceptible regexes were used. there is a global tap timeout per
  // file set in the package.json that will error if this test takes too long.
  const r = `1.2.3 ${wsLarge} <1.3.0`
  a.equal(new Range(r).range, '1.2.3 <1.3.0')
  a.equal(validRange(r), '1.2.3 <1.3.0')
  a.equal(minVersion(r).version, '1.2.3')
  a.equal(minSatisfying(['1.2.3'], r), '1.2.3')
  a.equal(maxSatisfying(['1.2.3'], r), '1.2.3')
})

test('range with 0', () => {
  const r = `1.2.3 ${zeroLarge} <1.3.0`
  a.throws(() => new Range(r).range)
  a.equal(validRange(r), null)
  a.throws(() => minVersion(r).version)
  a.equal(minSatisfying(['1.2.3'], r), null)
  a.equal(maxSatisfying(['1.2.3'], r), null)
})

test('semver version', () => {
  const v = `${wsMedium}1.2.3${wsMedium}`
  const tooLong = `${wsLarge}1.2.3${wsLarge}`
  a.equal(new SemVer(v).version, '1.2.3')
  a.throws(() => new SemVer(tooLong))
})

test('comparator', () => {
  const comparator = `${wsLarge}<${wsLarge}1.2.3${wsLarge}`
  a.equal(new Comparator(comparator).value, '<1.2.3')
})
