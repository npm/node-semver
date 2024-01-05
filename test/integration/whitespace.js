const t = require('node:test')
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

t.test('range with whitespace', (t) => {
  // a range with these extra characters would take a few minutes to process if
  // any redos susceptible regexes were used. there is a global tap timeout per
  // file set in the package.json that will error if this test takes too long.
  const r = `1.2.3 ${wsLarge} <1.3.0`
  a.deepEqual(new Range(r).range, '1.2.3 <1.3.0')
  a.deepEqual(validRange(r), '1.2.3 <1.3.0')
  a.deepEqual(minVersion(r).version, '1.2.3')
  a.deepEqual(minSatisfying(['1.2.3'], r), '1.2.3')
  a.deepEqual(maxSatisfying(['1.2.3'], r), '1.2.3')
})

t.test('range with 0', (t) => {
  const r = `1.2.3 ${zeroLarge} <1.3.0`
  a.throws(() => new Range(r).range)
  a.deepEqual(validRange(r), null)
  a.throws(() => minVersion(r).version)
  a.deepEqual(minSatisfying(['1.2.3'], r), null)
  a.deepEqual(maxSatisfying(['1.2.3'], r), null)
})

t.test('semver version', (t) => {
  const v = `${wsMedium}1.2.3${wsMedium}`
  const tooLong = `${wsLarge}1.2.3${wsLarge}`
  a.deepEqual(new SemVer(v).version, '1.2.3')
  a.throws(() => new SemVer(tooLong))
})

t.test('comparator', (t) => {
  const comparator = `${wsLarge}<${wsLarge}1.2.3${wsLarge}`
  a.deepEqual(new Comparator(comparator).value, '<1.2.3')
})
