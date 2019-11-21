const { test } = require('tap')
const SemVer = require('../../classes/semver')

test('really big numeric prerelease value', (t) => {
    const r = new SemVer(`1.2.3-beta.${  Number.MAX_SAFE_INTEGER  }0`)
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
      }, { name: 'TypeError', message: `Invalid Version: ${  v}` })
    })
  
    t.end()
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
      }, { name: 'TypeError', message: `Invalid Version: ${  v}` })
    })
  
    t.end()
  })
  