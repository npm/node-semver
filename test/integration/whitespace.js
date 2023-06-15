const { test } = require('tap')
const Range = require('../../classes/range')
const SemVer = require('../../classes/semver')
const Comparator = require('../../classes/comparator')
const validRange = require('../../ranges/valid')
const minVersion = require('../../ranges/min-version')
const minSatisfying = require('../../ranges/min-satisfying')
const maxSatisfying = require('../../ranges/max-satisfying')

const s = (n = 500000) => ' '.repeat(n)

test('regex dos via range whitespace', (t) => {
  // a range with this much whitespace would take a few minutes to process if
  // any redos susceptible regexes were used. there is a global tap timeout per
  // file set in the package.json that will error if this test takes too long.
  const r = `1.2.3 ${s()} <1.3.0`

  t.equal(new Range(r).range, '1.2.3 <1.3.0')
  t.equal(validRange(r), '1.2.3 <1.3.0')
  t.equal(minVersion(r).version, '1.2.3')
  t.equal(minSatisfying(['1.2.3'], r), '1.2.3')
  t.equal(maxSatisfying(['1.2.3'], r), '1.2.3')

  t.end()
})

test('semver version', (t) => {
  const v = `${s(125)}1.2.3${s(125)}`
  const tooLong = `${s()}1.2.3${s()}`
  t.equal(new SemVer(v).version, '1.2.3')
  t.throws(() => new SemVer(tooLong))
  t.end()
})

test('comparator', (t) => {
  const c = `${s()}<${s()}1.2.3${s()}`
  t.equal(new Comparator(c).value, '<1.2.3')
  t.end()
})
