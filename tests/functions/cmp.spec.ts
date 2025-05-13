import { test } from '@japa/runner'
import cmp from '../../src/functions/cmp.js'
import comparisons from '../fixtures/comparisons.js'
import equality from '../fixtures/equality.js'
import SemVer from '../../src/classes/semver.js'

test.group('cmp function tests', () => {
  test('invalid cmp usage', ({ assert }) => {
    assert.throws(() => cmp('1.2.3', 'a frog', '4.5.6'), TypeError, 'Invalid operator: a frog')
  })

  test('comparison tests')
    .with(comparisons)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isTrue(cmp(v0, '>', v1, loose), `cmp('${v0}' > '${v1}')`)
      assert.isTrue(cmp(v1, '<', v0, loose), `cmp('${v1}' < '${v0}')`)
      assert.isFalse(cmp(v1, '>', v0, loose), `!cmp('${v1}' > '${v0}')`)
      assert.isFalse(cmp(v0, '<', v1, loose), `!cmp('${v0}' < '${v1}')`)
      assert.isTrue(cmp(v1, '==', v1, loose), `cmp('${v1}' == '${v1}')`)
      assert.isTrue(cmp(v0, '>=', v1, loose), `cmp('${v0}' >= '${v1}')`)
      assert.isTrue(cmp(v1, '<=', v0, loose), `cmp('${v1}' <= '${v0}')`)
      assert.isTrue(cmp(v0, '!=', v1, loose), `cmp('${v0}' != '${v1}')`)
    })

  test('equality tests')
    .with(equality)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isTrue(cmp(v0, '', v1, loose), `cmp(${v0} "" ${v1})`)
      assert.isTrue(cmp(v0, '=', v1, loose), `cmp(${v0}=${v1})`)
      assert.isTrue(cmp(v0, '==', v1, loose), `cmp(${v0}==${v1})`)
      assert.isFalse(cmp(v0, '!=', v1, loose), `!cmp(${v0}!=${v1})`)
      assert.isFalse(cmp(v0, '===', v1, loose), `!cmp(${v0}===${v1})`)

      // also test with an object. they are === because obj.version matches
      assert.isTrue(cmp(new SemVer(v0, { loose }), '===', new SemVer(v1, { loose })), `cmp(${v0}===${v1}) object`)

      assert.isTrue(cmp(v0, '!==', v1, loose), `cmp(${v0}!==${v1})`)

      assert.isFalse(cmp(new SemVer(v0, loose), '!==', new SemVer(v1, loose)), `cmp(${v0}!==${v1}) object`)
    })
})
