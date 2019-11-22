const { test } = require('tap')
const SemVer = require('../../classes/semver')
const increments = require('../fixtures/increments.js')
const comparisons = require('../fixtures/comparisons.js')
const equality = require('../fixtures/equality.js')
const invalidVersions = require('../fixtures/invalid-versions')

test('comparisons', t => {
  t.plan(comparisons.length)
  comparisons.forEach(([v0, v1, opt]) => t.test(`${v0} ${v1}`, t => {
    const s0 = new SemVer(v0, opt)
    const s1 = new SemVer(v1, opt)
    t.equal(s0.compare(s1), 1)
    t.equal(s0.compare(v1), 1)
    t.equal(s1.compare(s0), -1)
    t.equal(s1.compare(v0), -1)
    t.equal(s0.compare(v0), 0)
    t.equal(s1.compare(v1), 0)
    t.end()
  }))
})

test('equality', t => {
  t.plan(equality.length)
  equality.forEach(([v0, v1, loose]) => t.test(`${v0} ${v1} ${loose}`, t => {
    const s0 = new SemVer(v0, loose)
    const s1 = new SemVer(v1, loose)
    t.equal(s0.compare(s1), 0)
    t.equal(s1.compare(s0), 0)
    t.equal(s0.compare(v1), 0)
    t.equal(s1.compare(v0), 0)
    t.equal(s0.compare(s0), 0)
    t.equal(s1.compare(s1), 0)
    t.equal(s0.comparePre(s1), 0, 'comparePre just to hit that code path')
    t.end()
  }))
})

test('toString equals parsed version', t => {
  t.equal(String(new SemVer('v1.2.3')), '1.2.3')
  t.end()
})

test('throws when presented with garbage', t => {
  t.plan(invalidVersions.length)
  invalidVersions.forEach(([v, msg, opts]) =>
    t.throws(() => new SemVer(v, opts), msg))
})

test('return SemVer arg to ctor if options match', t => {
  const s = new SemVer('1.2.3', { loose: true, includePrerelease: true })
  t.equal(new SemVer(s, {loose: true, includePrerelease: true}), s,
    'get same object when options match')
  t.notEqual(new SemVer(s), s, 'get new object when options match')
  t.end()
})

test('really big numeric prerelease value', (t) => {
  const r = new SemVer(`1.2.3-beta.${Number.MAX_SAFE_INTEGER}0`)
  t.strictSame(r.prerelease, [ 'beta', '90071992547409910' ])
  t.end()
})

test('invalid version numbers', (t) => {
  ['1.2.3.4',
    'NOT VALID',
    1.2,
    null,
    'Infinity.NaN.Infinity'
  ].forEach((v) => {
    t.throws(() => {
      new SemVer(v) // eslint-disable-line no-new
    }, { name: 'TypeError', message: `Invalid Version: ${v}` })
  })

  t.end()
})

test('incrementing', t => {
  t.plan(increments.length)
  increments.forEach(([
    version,
    inc,
    expect,
    options,
    id,
  ]) => t.test(`${version} ${inc} ${id || ''}`.trim(), t => {
    t.plan(1)
    if (expect === null)
      t.throws(() => new SemVer(version, options).inc(inc, id))
    else
      t.equal(new SemVer(version, options).inc(inc, id).version, expect)
  }))
})

test('compare main vs pre', (t) => {
  const s = new SemVer('1.2.3')
  t.equal(s.compareMain('2.3.4'), -1)
  t.equal(s.compareMain('1.2.4'), -1)
  t.equal(s.compareMain('0.1.2'), 1)
  t.equal(s.compareMain('1.2.2'), 1)
  t.equal(s.compareMain('1.2.3-pre'), 0)

  const p = new SemVer('1.2.3-alpha.0.pr.1')
  t.equal(p.comparePre('9.9.9-alpha.0.pr.1'), 0)
  t.equal(p.comparePre('1.2.3'), -1)
  t.equal(p.comparePre('1.2.3-alpha.0.pr.2'), -1)
  t.equal(p.comparePre('1.2.3-alpha.0.2'), 1)

  t.end()
})

test('invalid version numbers', (t) => {
  ['1.2.3.4',
    'NOT VALID',
    1.2,
    null,
    'Infinity.NaN.Infinity'
  ].forEach((v) => {
    t.throws(() => {
      new SemVer(v) // eslint-disable-line no-new
    }, { name: 'TypeError', message: `Invalid Version: ${v}` })
  })

  t.end()
})

test('compareBuild', (t) => {
  const noBuild = new SemVer('1.0.0')
  const build0 = new SemVer('1.0.0+0')
  const build1 = new SemVer('1.0.0+1')
  const build10 = new SemVer('1.0.0+1.0')
  t.equal(noBuild.compareBuild(build0), -1)
  t.equal(build0.compareBuild(build0), 0)
  t.equal(build0.compareBuild(noBuild), 1)

  t.equal(build0.compareBuild('1.0.0+0.0'), -1)
  t.equal(build0.compareBuild(build1), -1)
  t.equal(build1.compareBuild(build0), 1)
  t.equal(build10.compareBuild(build1), 1)

  t.end()
})
