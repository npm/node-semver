import { test } from '@japa/runner'
import SemVer from '../../src/classes/semver.js'
import increments from '../fixtures/increments.js'
import comparisons from '../fixtures/comparisons.js'
import equality from '../fixtures/equality.js'
import invalidVersions from '../fixtures/invalid-versions.js'
import validVersions from '../fixtures/valid-versions.js'

test.group('SemVer Tests', () => {
  test('valid versions')
    .with(validVersions)
    .run(({ assert }, [v, major, minor, patch, prerelease, build]) => {
      const s = new SemVer(v)
      assert.strictEqual(s.major, major)
      assert.strictEqual(s.minor, minor)
      assert.strictEqual(s.patch, patch)
      assert.deepEqual(s.prerelease, prerelease)
      assert.deepEqual(s.build, build)
      assert.strictEqual(s.raw, v)
    })

  test('comparisons')
    .with(comparisons)
    .run(({ assert }, [v0, v1, opt]) => {
      const s0 = new SemVer(v0, opt)
      const s1 = new SemVer(v1, opt)
      assert.strictEqual(s0.compare(s1), 1)
      assert.strictEqual(s0.compare(v1), 1)
      assert.strictEqual(s1.compare(s0), -1)
      assert.strictEqual(s1.compare(v0), -1)
      assert.strictEqual(s0.compare(v0), 0)
      assert.strictEqual(s1.compare(v1), 0)
    })

  test('equality')
    .with(equality)
    .run(({ assert }, [v0, v1, loose]) => {
      const s0 = new SemVer(v0, loose)
      const s1 = new SemVer(v1, loose)
      assert.strictEqual(s0.compare(s1), 0)
      assert.strictEqual(s1.compare(s0), 0)
      assert.strictEqual(s0.compare(v1), 0)
      assert.strictEqual(s1.compare(v0), 0)
      assert.strictEqual(s0.compare(s0), 0)
      assert.strictEqual(s1.compare(s1), 0)
      assert.strictEqual(s0.comparePre(s1), 0, 'comparePre just to hit that code path')
    })

  test('toString equals parsed version', ({ assert }) => {
    assert.strictEqual(String(new SemVer('v1.2.3')), '1.2.3')
  })

  test('throws when presented with garbage')
    .with(invalidVersions)
    .run(({ assert }, [v, msg, opts]) => {
      // @ts-expect-error Force invalid type
      assert.throws(() => new SemVer(v, opts), undefined, undefined, msg)
    })

  test('return SemVer arg to ctor if options match', ({ assert }) => {
    const s = new SemVer('1.2.3', { loose: true, includePrerelease: true })
    assert.strictEqual(new SemVer(s, { loose: true, includePrerelease: true }), s, 'get same object when options match')
    assert.notStrictEqual(new SemVer(s), s, 'get new object when options do not match')
  })

  test('really big numeric prerelease value', ({ assert }) => {
    const r = new SemVer(`1.2.3-beta.${Number.MAX_SAFE_INTEGER}0`)
    assert.deepEqual(r.prerelease, ['beta', '90071992547409910'])
  })

  test('invalid version numbers', ({ assert }) => {
    const invalidNumbers = ['1.2.3.4', 'NOT VALID', 1.2, null, 'Infinity.NaN.Infinity']
    invalidNumbers.forEach((v) => {
      assert.throws(
        // @ts-expect-error Force invalid type
        () => new SemVer(v)
        // {
        //   name: 'TypeError',
        //   message:
        //     typeof v === 'string'
        //       ? `Invalid Version: ${v}`
        //       : `Invalid version. Must be a string. Got type "${typeof v}".`,
        // }
      )
    })
  })

  test('incrementing')
    .with(increments)
    .run(({ assert }, [version, inc, expect, options, id, base]) => {
      if (expect === null) {
        assert.throws(() => new SemVer(version, options).inc(inc, id, base))
      } else {
        const incremented = new SemVer(version, options).inc(inc, id, base)
        assert.strictEqual(incremented.version, expect)
        if (incremented.build.length) {
          assert.strictEqual(incremented.raw, `${expect}+${incremented.build.join('.')}`)
        } else {
          assert.strictEqual(incremented.raw, expect)
        }
      }
    })

  test('invalid increments', ({ assert }) => {
    assert.throws(
      () => new SemVer('1.2.3').inc('prerelease', '', false),
      Error,
      'invalid increment argument: identifier is empty'
    )
    assert.throws(
      () => new SemVer('1.2.3-dev').inc('prerelease', 'dev', false),
      Error,
      'invalid increment argument: identifier already exists'
    )
    assert.throws(
      () => new SemVer('1.2.3').inc('prerelease', 'invalid/preid'),
      Error,
      'invalid identifier: invalid/preid'
    )
  })

  test('increment side-effects', ({ assert }) => {
    const v = new SemVer('1.0.0')
    try {
      v.inc('prerelease', 'hot/mess')
    } catch {
      // ignore but check that the version has not changed
    }
    assert.strictEqual(v.toString(), '1.0.0')
  })

  test('compare main vs pre', ({ assert }) => {
    const s = new SemVer('1.2.3')
    assert.strictEqual(s.compareMain('2.3.4'), -1)
    assert.strictEqual(s.compareMain('1.2.4'), -1)
    assert.strictEqual(s.compareMain('0.1.2'), 1)
    assert.strictEqual(s.compareMain('1.2.2'), 1)
    assert.strictEqual(s.compareMain('1.2.3-pre'), 0)

    const p = new SemVer('1.2.3-alpha.0.pr.1')
    assert.strictEqual(p.comparePre('9.9.9-alpha.0.pr.1'), 0)
    assert.strictEqual(p.comparePre('1.2.3'), -1)
    assert.strictEqual(p.comparePre('1.2.3-alpha.0.pr.2'), -1)
    assert.strictEqual(p.comparePre('1.2.3-alpha.0.2'), 1)
  })

  test('compareBuild', ({ assert }) => {
    const noBuild = new SemVer('1.0.0')
    const build0 = new SemVer('1.0.0+0')
    const build1 = new SemVer('1.0.0+1')
    const build10 = new SemVer('1.0.0+1.0')
    assert.strictEqual(noBuild.compareBuild(build0), -1)
    assert.strictEqual(build0.compareBuild(build0), 0)
    assert.strictEqual(build0.compareBuild(noBuild), 1)

    assert.strictEqual(build0.compareBuild('1.0.0+0.0'), -1)
    assert.strictEqual(build0.compareBuild(build1), -1)
    assert.strictEqual(build1.compareBuild(build0), 1)
    assert.strictEqual(build10.compareBuild(build1), 1)
  })
})
