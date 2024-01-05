const t = require('node:test')
const a = require('node:assert')

const cmp = require('../../functions/cmp')
const comparisons = require('../fixtures/comparisons.js')
const equality = require('../fixtures/equality.js')
const SemVer = require('../../classes/semver')

t.test('invalid cmp usage', (t) => {
  a.throws(() => {
    cmp('1.2.3', 'a frog', '4.5.6')
  }, new TypeError('Invalid operator: a frog'))
})

t.test('comparison tests', async t => {
  for (const [v0, v1, loose] of comparisons) {
    await t.test(`${v0} ${v1} ${loose}`, t => {
      a.ok(cmp(v0, '>', v1, loose), `cmp('${v0}' > '${v1}')`)
      a.ok(cmp(v1, '<', v0, loose), `cmp('${v1}' < '${v0}')`)
      a.ok(!cmp(v1, '>', v0, loose), `!cmp('${v1}' > '${v0}')`)
      a.ok(!cmp(v0, '<', v1, loose), `!cmp('${v0}' < '${v1}')`)
      a.ok(cmp(v1, '==', v1, loose), `cmp('${v1}' == '${v1}')`)
      a.ok(cmp(v0, '>=', v1, loose), `cmp('${v0}' >= '${v1}')`)
      a.ok(cmp(v1, '<=', v0, loose), `cmp('${v1}' <= '${v0}')`)
      a.ok(cmp(v0, '!=', v1, loose), `cmp('${v0}' != '${v1}')`)
    })
  }
})

t.test('equality tests', async t => {
  for (const [v0, v1, loose] of equality) {
    await t.test(`${v0} ${v1} ${loose}`, t => {
      a.ok(cmp(v0, '', v1, loose), `cmp(${v0} "" ${v1})`)
      a.ok(cmp(v0, '=', v1, loose), `cmp(${v0}=${v1})`)
      a.ok(cmp(v0, '==', v1, loose), `cmp(${v0}==${v1})`)
      a.ok(!cmp(v0, '!=', v1, loose), `!cmp(${v0}!=${v1})`)
      a.ok(!cmp(v0, '===', v1, loose), `!cmp(${v0}===${v1})`)

      // also test with an object. they are === because obj.version matches
      a.ok(cmp(new SemVer(v0, { loose: loose }), '===',
        new SemVer(v1, { loose: loose })),
        `!cmp(${v0}===${v1}) object`)

      a.ok(cmp(v0, '!==', v1, loose), `cmp(${v0}!==${v1})`)

      a.ok(!cmp(new SemVer(v0, loose), '!==', new SemVer(v1, loose)),
        `cmp(${v0}!==${v1}) object`)
    })
  }
})
