const { test } = require('tap')
const { Range, Comparator } = require('../../classes/range')

test('strict vs loose ranges', (t) => {
    [['>=01.02.03', '>=1.2.3'],
      ['~1.02.03beta', '>=1.2.3-beta <1.3.0']
    ].forEach((v) => {
      const loose = v[0]
      const comps = v[1]
      t.throws(() => {
        new Range(loose) // eslint-disable-line no-new
      })
      t.equal(new Range(loose, true).range, comps)
    })
    t.end()
  })

  test("comparator testing", t => {
    const c = new Comparator(">=1.2.3");
    t.ok(c.test("1.2.4"));
    const c2 = new Comparator(c);
    t.ok(c2.test("1.2.4"));
    const c3 = new Comparator(c, true);
    t.ok(c3.test("1.2.4"));
    // test an invalid version, should not throw
    const c4 = new Comparator(c);
    t.notOk(c4.test("not a version string"));
    t.end();
  });
  
  test('tostrings', (t) => {
    t.equal(new Range('>= v1.2.3').toString(), '>=1.2.3')
    t.equal(new Comparator('>= v1.2.3').toString(), '>=1.2.3')
    t.end()
  })
  