const t = require('node:test')
const a = require('node:assert')

const SemVer = require('../../classes/semver')
const increments = require('../fixtures/increments.js')
const comparisons = require('../fixtures/comparisons.js')
const equality = require('../fixtures/equality.js')
const invalidVersions = require('../fixtures/invalid-versions')

t.test('comparisons', async t => {
  for (const [v0, v1, opt] of comparisons) {
    await t.test(`${v0} ${v1}`, t => {
      const s0 = new SemVer(v0, opt)
      const s1 = new SemVer(v1, opt)
      a.equal(s0.compare(s1), 1)
      a.equal(s0.compare(v1), 1)
      a.equal(s1.compare(s0), -1)
      a.equal(s1.compare(v0), -1)
      a.equal(s0.compare(v0), 0)
      a.equal(s1.compare(v1), 0)
    })
  }
})

t.test('equality', async t => {
  for (const [v0, v1, loose] of equality) {
    await t.test(`${v0} ${v1} ${loose}`, t => {
      const s0 = new SemVer(v0, loose)
      const s1 = new SemVer(v1, loose)
      a.equal(s0.compare(s1), 0)
      a.equal(s1.compare(s0), 0)
      a.equal(s0.compare(v1), 0)
      a.equal(s1.compare(v0), 0)
      a.equal(s0.compare(s0), 0)
      a.equal(s1.compare(s1), 0)
      a.equal(s0.comparePre(s1), 0, 'comparePre just to hit that code path')
    })
  }
})

t.test('toString equals parsed version', t => {
  a.equal(String(new SemVer('v1.2.3')), '1.2.3')
})

t.test('throws when presented with garbage', t => {
  for (const [v, msg, opts] of invalidVersions) {
    a.throws(() => new SemVer(v, opts), null, msg)
  }
})

t.test('return SemVer arg to ctor if options match', t => {
  const s = new SemVer('1.2.3', { loose: true, includePrerelease: true })
  a.equal(new SemVer(s, { loose: true, includePrerelease: true }), s,
    'get same object when options match')
  a.notEqual(new SemVer(s), s, 'get new object when options match')
})

t.test('really big numeric prerelease value', (t) => {
  const r = new SemVer(`1.2.3-beta.${Number.MAX_SAFE_INTEGER}0`)
  a.deepEqual(r.prerelease, ['beta', '90071992547409910'])
})

t.test('invalid version numbers', (t) => {
  a.throws(() => new SemVer('1.2.3.4'), new TypeError('Invalid Version: 1.2.3.4'))
  a.throws(() => new SemVer('NOT VALID'), new TypeError('Invalid Version: NOT VALID'))
  a.throws(() => new SemVer('1.2'), new TypeError('Invalid Version: 1.2'))
  a.throws(() => new SemVer(null),
    new TypeError('Invalid version. Must be a string. Got type "object".'))
  a.throws(() => new SemVer('Infinity.NaN.Infinity'),
    new TypeError('Invalid Version: Infinity.NaN.Infinity'))
})

t.test('incrementing', async t => {
  for (const [version, inc, expect, options, id, base] of increments) {
    await t.test(`${version} ${inc} ${id || ''}`.trim(), t => {
      if (expect === null) {
        a.throws(() => new SemVer(version, options).inc(inc, id, base))
      } else {
        const incremented = new SemVer(version, options).inc(inc, id, base)
        a.equal(incremented.version, expect)
        if (incremented.build.length) {
          a.equal(incremented.raw, `${expect}+${incremented.build.join('.')}`)
        } else {
          a.equal(incremented.raw, expect)
        }
      }
    })
  }
})

t.test('compare main vs pre', (t) => {
  const s = new SemVer('1.2.3')
  a.equal(s.compareMain('2.3.4'), -1)
  a.equal(s.compareMain('1.2.4'), -1)
  a.equal(s.compareMain('0.1.2'), 1)
  a.equal(s.compareMain('1.2.2'), 1)
  a.equal(s.compareMain('1.2.3-pre'), 0)

  const p = new SemVer('1.2.3-alpha.0.pr.1')
  a.equal(p.comparePre('9.9.9-alpha.0.pr.1'), 0)
  a.equal(p.comparePre('1.2.3'), -1)
  a.equal(p.comparePre('1.2.3-alpha.0.pr.2'), -1)
  a.equal(p.comparePre('1.2.3-alpha.0.2'), 1)
})

t.test('compareBuild', (t) => {
  const noBuild = new SemVer('1.0.0')
  const build0 = new SemVer('1.0.0+0')
  const build1 = new SemVer('1.0.0+1')
  const build10 = new SemVer('1.0.0+1.0')
  a.equal(noBuild.compareBuild(build0), -1)
  a.equal(build0.compareBuild(build0), 0)
  a.equal(build0.compareBuild(noBuild), 1)

  a.equal(build0.compareBuild('1.0.0+0.0'), -1)
  a.equal(build0.compareBuild(build1), -1)
  a.equal(build1.compareBuild(build0), 1)
  a.equal(build10.compareBuild(build1), 1)
})
