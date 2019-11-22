const { test } = require('tap')
const cmp = require('../../functions/cmp')
const comparisons = require('../fixtures/comparisons.js')
const equality = require('../fixtures/equality.js')
const SemVer = require('../../classes/semver')

test('invalid cmp usage', (t) => {
  t.throws(() => {
    cmp('1.2.3', 'a frog', '4.5.6')
  }, new TypeError('Invalid operator: a frog'))
  t.end()
})

test('comparison tests', t => {
  t.plan(comparisons.length)
  comparisons.forEach(([v0, v1, loose]) => t.test(`${v0} ${v1} ${loose}`, t => {
    t.plan(8)
    t.ok(cmp(v0, '>', v1, loose), `cmp('${v0}' > '${v1}')`)
    t.ok(cmp(v1, '<', v0, loose), `cmp('${v1}' < '${v0}')`)
    t.ok(!cmp(v1, '>', v0, loose), `!cmp('${v1}' > '${v0}')`)
    t.ok(!cmp(v0, '<', v1, loose), `!cmp('${v0}' < '${v1}')`)
    t.ok(cmp(v1, '==', v1, loose), `cmp('${v1}' == '${v1}')`)
    t.ok(cmp(v0, '>=', v1, loose), `cmp('${v0}' >= '${v1}')`)
    t.ok(cmp(v1, '<=', v0, loose), `cmp('${v1}' <= '${v0}')`)
    t.ok(cmp(v0, '!=', v1, loose), `cmp('${v0}' != '${v1}')`)
  }))
})

test('equality tests', t => {
  t.plan(equality.length)
  equality.forEach(([v0, v1, loose]) => t.test(`${v0} ${v1} ${loose}`, t => {
    t.plan(8)
    t.ok(cmp(v0, '', v1, loose), `cmp(${v0} "" ${v1})`)
    t.ok(cmp(v0, '=', v1, loose), `cmp(${v0}=${v1})`)
    t.ok(cmp(v0, '==', v1, loose), `cmp(${v0}==${v1})`)
    t.ok(!cmp(v0, '!=', v1, loose), `!cmp(${v0}!=${v1})`)
    t.ok(!cmp(v0, '===', v1, loose), `!cmp(${v0}===${v1})`)

    // also test with an object. they are === because obj.version matches
    t.ok(cmp(new SemVer(v0, { loose: loose }), '===',
      new SemVer(v1, { loose: loose })),
    `!cmp(${v0}===${v1}) object`)

    t.ok(cmp(v0, '!==', v1, loose), `cmp(${v0}!==${v1})`)

    t.ok(!cmp(new SemVer(v0, loose), '!==', new SemVer(v1, loose)),
      `cmp(${v0}!==${v1}) object`)
  }))
})
