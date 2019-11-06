const { test } = require('tap')
const semver = require('../')
const eq = semver.eq
const gt = semver.gt
const lt = semver.lt
const neq = semver.neq
const cmp = semver.cmp
const gte = semver.gte
const lte = semver.lte
const SemVer = semver.SemVer

test('comparison tests', (t) => {
  // [version1, version2]
  // version1 should be greater than version2
  [['0.0.0', '0.0.0-foo'],
    ['0.0.1', '0.0.0'],
    ['1.0.0', '0.9.9'],
    ['0.10.0', '0.9.0'],
    ['0.99.0', '0.10.0', {}],
    ['2.0.0', '1.2.3', { loose: false }],
    ['v0.0.0', '0.0.0-foo', true],
    ['v0.0.1', '0.0.0', { loose: true }],
    ['v1.0.0', '0.9.9', true],
    ['v0.10.0', '0.9.0', true],
    ['v0.99.0', '0.10.0', true],
    ['v2.0.0', '1.2.3', true],
    ['0.0.0', 'v0.0.0-foo', true],
    ['0.0.1', 'v0.0.0', true],
    ['1.0.0', 'v0.9.9', true],
    ['0.10.0', 'v0.9.0', true],
    ['0.99.0', 'v0.10.0', true],
    ['2.0.0', 'v1.2.3', true],
    ['1.2.3', '1.2.3-asdf'],
    ['1.2.3', '1.2.3-4'],
    ['1.2.3', '1.2.3-4-foo'],
    ['1.2.3-5-foo', '1.2.3-5'],
    ['1.2.3-5', '1.2.3-4'],
    ['1.2.3-5-foo', '1.2.3-5-Foo'],
    ['3.0.0', '2.7.2+asdf'],
    ['1.2.3-a.10', '1.2.3-a.5'],
    ['1.2.3-a.b', '1.2.3-a.5'],
    ['1.2.3-a.b', '1.2.3-a'],
    ['1.2.3-a.b.c.10.d.5', '1.2.3-a.b.c.5.d.100'],
    ['1.2.3-r2', '1.2.3-r100'],
    ['1.2.3-r100', '1.2.3-R2'],
  ].forEach((v) => {
    const v0 = v[0]
    const v1 = v[1]
    const loose = v[2]
    t.ok(gt(v0, v1, loose), `gt('${  v0  }', '${  v1  }')`)
    t.ok(lt(v1, v0, loose), `lt('${  v1  }', '${  v0  }')`)
    t.ok(!gt(v1, v0, loose), `!gt('${  v1  }', '${  v0  }')`)
    t.ok(!lt(v0, v1, loose), `!lt('${  v0  }', '${  v1  }')`)
    t.ok(eq(v0, v0, loose), `eq('${  v0  }', '${  v0  }')`)
    t.ok(eq(v1, v1, loose), `eq('${  v1  }', '${  v1  }')`)
    t.ok(neq(v0, v1, loose), `neq('${  v0  }', '${  v1  }')`)
    t.ok(cmp(v1, '==', v1, loose), `cmp('${  v1  }' == '${  v1  }')`)
    t.ok(cmp(v0, '>=', v1, loose), `cmp('${  v0  }' >= '${  v1  }')`)
    t.ok(cmp(v1, '<=', v0, loose), `cmp('${  v1  }' <= '${  v0  }')`)
    t.ok(cmp(v0, '!=', v1, loose), `cmp('${  v0  }' != '${  v1  }')`)
  })
  t.end()
})

test('equality tests', (t) => {
  // [version1, version2]
  // version1 should be equivalent to version2
  [['1.2.3', 'v1.2.3', true],
    ['1.2.3', '=1.2.3', true],
    ['1.2.3', 'v 1.2.3', true],
    ['1.2.3', '= 1.2.3', true],
    ['1.2.3', ' v1.2.3', true],
    ['1.2.3', ' =1.2.3', true],
    ['1.2.3', ' v 1.2.3', true],
    ['1.2.3', ' = 1.2.3', true],
    ['1.2.3-0', 'v1.2.3-0', true],
    ['1.2.3-0', '=1.2.3-0', true],
    ['1.2.3-0', 'v 1.2.3-0', true],
    ['1.2.3-0', '= 1.2.3-0', true],
    ['1.2.3-0', ' v1.2.3-0', true],
    ['1.2.3-0', ' =1.2.3-0', true],
    ['1.2.3-0', ' v 1.2.3-0', true],
    ['1.2.3-0', ' = 1.2.3-0', true],
    ['1.2.3-1', 'v1.2.3-1', true],
    ['1.2.3-1', '=1.2.3-1', true],
    ['1.2.3-1', 'v 1.2.3-1', true],
    ['1.2.3-1', '= 1.2.3-1', true],
    ['1.2.3-1', ' v1.2.3-1', true],
    ['1.2.3-1', ' =1.2.3-1', true],
    ['1.2.3-1', ' v 1.2.3-1', true],
    ['1.2.3-1', ' = 1.2.3-1', true],
    ['1.2.3-beta', 'v1.2.3-beta', true],
    ['1.2.3-beta', '=1.2.3-beta', true],
    ['1.2.3-beta', 'v 1.2.3-beta', true],
    ['1.2.3-beta', '= 1.2.3-beta', true],
    ['1.2.3-beta', ' v1.2.3-beta', true],
    ['1.2.3-beta', ' =1.2.3-beta', true],
    ['1.2.3-beta', ' v 1.2.3-beta', true],
    ['1.2.3-beta', ' = 1.2.3-beta', true],
    ['1.2.3-beta+build', ' = 1.2.3-beta+otherbuild', true],
    ['1.2.3+build', ' = 1.2.3+otherbuild', true],
    ['1.2.3-beta+build', '1.2.3-beta+otherbuild'],
    ['1.2.3+build', '1.2.3+otherbuild'],
    ['  v1.2.3+build', '1.2.3+otherbuild']
  ].forEach((v) => {
    const v0 = v[0]
    const v1 = v[1]
    const loose = v[2]
    t.ok(eq(v0, v1, loose), `eq('${  v0  }', '${  v1  }')`)
    t.ok(!neq(v0, v1, loose), `!neq('${  v0  }', '${  v1  }')`)
    t.ok(cmp(v0, '==', v1, loose), `cmp(${  v0  }==${  v1  })`)
    t.ok(!cmp(v0, '!=', v1, loose), `!cmp(${  v0  }!=${  v1  })`)
    t.ok(!cmp(v0, '===', v1, loose), `!cmp(${  v0  }===${  v1  })`)

    // also test with an object. they are === because obj.version matches
    t.ok(cmp(new SemVer(v0, { loose: loose }), '===',
      new SemVer(v1, { loose: loose })),
      `!cmp(${  v0  }===${  v1  }) object`)

    t.ok(cmp(v0, '!==', v1, loose), `cmp(${  v0  }!==${  v1  })`)

    t.ok(!cmp(new SemVer(v0, loose), '!==', new SemVer(v1, loose)),
      `cmp(${  v0  }!==${  v1  }) object`)

    t.ok(!gt(v0, v1, loose), `!gt('${  v0  }', '${  v1  }')`)
    t.ok(gte(v0, v1, loose), `gte('${  v0  }', '${  v1  }')`)
    t.ok(!lt(v0, v1, loose), `!lt('${  v0  }', '${  v1  }')`)
    t.ok(lte(v0, v1, loose), `lte('${  v0  }', '${  v1  }')`)
  })
  t.end()
})
