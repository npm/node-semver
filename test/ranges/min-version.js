'use strict'

const { test } = require('tap')
const minVersion = require('../../ranges/min-version')
const semver = require('../..')

test('minimum version in range tests', (t) => {
  // [range, minimum, loose]
  [
    // Stars
    ['*', '0.0.0'],
    ['* || >=2', '0.0.0'],
    ['>=2 || *', '0.0.0'],
    ['>2 || *', '0.0.0'],

    // equal
    ['1.0.0', '1.0.0'],
    ['1.0', '1.0.0'],
    ['1.0.x', '1.0.0'],
    ['1.0.*', '1.0.0'],
    ['1', '1.0.0'],
    ['1.x.x', '1.0.0'],
    ['1.x.x', '1.0.0'],
    ['1.*.x', '1.0.0'],
    ['1.x.*', '1.0.0'],
    ['1.x', '1.0.0'],
    ['1.*', '1.0.0'],
    ['=1.0.0', '1.0.0'],

    // Tilde
    ['~1.1.1', '1.1.1'],
    ['~1.1.1-beta', '1.1.1-beta'],
    ['~1.1.1 || >=2', '1.1.1'],

    // Caret
    ['^1.1.1', '1.1.1'],
    ['^1.1.1-beta', '1.1.1-beta'],
    ['^1.1.1 || >=2', '1.1.1'],
    ['^2.16.2 ^2.16', '2.16.2'],

    // '-' operator
    ['1.1.1 - 1.8.0', '1.1.1'],
    ['1.1 - 1.8.0', '1.1.0'],

    // Less / less or equal
    ['<2', '0.0.0'],
    ['<0.0.0-beta', '0.0.0-0'],
    ['<0.0.1-beta', '0.0.0'],
    ['<2 || >4', '0.0.0'],
    ['>4 || <2', '0.0.0'],
    ['<=2 || >=4', '0.0.0'],
    ['>=4 || <=2', '0.0.0'],
    ['<0.0.0-beta >0.0.0-alpha', '0.0.0-alpha.0'],
    ['>0.0.0-alpha <0.0.0-beta', '0.0.0-alpha.0'],

    // Greater than or equal
    ['>=1.1.1 <2 || >=2.2.2 <2', '1.1.1'],
    ['>=2.2.2 <2 || >=1.1.1 <2', '1.1.1'],

    // Greater than but not equal
    ['>1.0.0', '1.0.1'],
    ['>1.0.0-0', '1.0.0-0.0'],
    ['>1.0.0-beta', '1.0.0-beta.0'],
    ['>2 || >1.0.0', '1.0.1'],
    ['>2 || >1.0.0-0', '1.0.0-0.0'],
    ['>2 || >1.0.0-beta', '1.0.0-beta.0'],

    // Impossible range
    ['>4 <3', null],
  ].forEach((tuple) => {
    const range = tuple[0]
    const version = tuple[1]
    const loose = tuple[2] || false
    const msg = `minVersion(${range}, ${loose}) = ${version}`
    const min = minVersion(range, loose)
    t.ok(min === version || (min && min.version === version), msg, {
      found: min,
      wanted: version,
    })
  })
  t.end()
})

test('minimum explicitly admitted prerelease', (t) => {
  const range = '>0.0.0 <=0.0.1-0'
  const expected = '0.0.1-0'
  t.ok(semver.satisfies(expected, range), 'expected witness satisfies the range')
  t.ok(semver.gt(expected, '0.0.0'), 'witness exceeds the lower bound')
  t.ok(semver.lte(expected, '0.0.1-0'), 'witness meets the upper bound')
  const min = semver.minVersion(range)
  t.equal(min && min.version, expected, 'minimum is the admitted prerelease floor')
  t.type(min, semver.SemVer)
  t.match(min, { version: expected, raw: expected })
  t.end()
})

test('prerelease permission follows the comparator set and numeric tuple', (t) => {
  [
    ['<=0.0.1-0 >0.0.0', '0.0.1-0'],
    ['>1.2.3 <1.2.4-beta', '1.2.4-0'],
    ['<1.2.4-beta >1.2.3', '1.2.4-0'],
    ['>1.2.3 <=1.2.4-beta', '1.2.4-0'],
    ['>1.2.3 <=1.2.4', '1.2.4'],
    ['>1.2.3 <=1.2.5-alpha', '1.2.4'],
    ['>1.2.3 <=1.3.4-alpha', '1.2.4'],
    ['>1.2.3 <=2.2.4-alpha', '1.2.4'],
    ['>1.2.3 >=1.2.4-alpha <=1.2.4-beta', '1.2.4-alpha'],
    ['>1.2.3 >1.2.4-alpha <=1.2.4-beta', '1.2.4-alpha.0'],
    ['>1.2.3 1.2.4-beta', '1.2.4-beta'],
    ['>0.0.0 <=0.0.1-0 || >=1.0.0', '0.0.1-0'],
    ['>=1.0.0 || >0.0.0 <=0.0.1-0', '0.0.1-0'],
    ['>1.2.3 || >=1.2.4-alpha', '1.2.4-alpha'],
    ['>=1.2.4-alpha || >1.2.3', '1.2.4-alpha'],
  ].forEach(([range, expected]) => {
    t.ok(semver.satisfies(expected, range), `${expected} satisfies ${range}`)
    const min = semver.minVersion(range)
    t.equal(min && min.version, expected, `minimum of ${range}`)
    t.type(min, semver.SemVer)
  })
  t.end()
})

test('prerelease permission does not weaken other bounds', (t) => {
  [
    '>1.2.3 <1.2.4-0',
    '>1.2.3 <1.2.4',
    '>1.2.3 >=1.2.4 <=1.2.4-beta',
  ].forEach((range) => {
    t.equal(semver.minVersion(range), null, `no minimum for ${range}`)
  })
  t.end()
})

test('prereleases require permission for their own tuple in their own branch', (t) => {
  [
    '>1.2.3 <=1.2.4',
    '>1.2.3 <=1.2.5-alpha',
    '>1.2.3 <=1.3.4-alpha',
    '>1.2.3 <=2.2.4-alpha',
    '>1.2.3 || >=1.2.4-alpha',
    '>=1.2.4-alpha || >1.2.3',
  ].forEach((range) => {
    t.notOk(semver.satisfies('1.2.4-0', range), `1.2.4-0 is excluded by ${range}`)
  })
  t.end()
})

test('explicit prerelease admission respects options', (t) => {
  const range = '>0.0.0 <=0.0.1-0'
  const expected = '0.0.1-0'
  ;[false, { includePrerelease: false }, { includePrerelease: true }].forEach((options) => {
    t.ok(semver.satisfies(expected, range, options), 'expected witness satisfies with options')
    const min = semver.minVersion(range, options)
    t.equal(min && min.version, expected)
    t.type(min, semver.SemVer)
    t.match(min, { version: expected, raw: expected })
  })
  t.end()
})

test('explicit prerelease admission respects loose parsing', (t) => {
  const range = '>01.02.03 <=01.02.04-0'
  const expected = '1.2.4-0'
  ;[true, { loose: true }].forEach((options) => {
    t.ok(semver.satisfies(expected, range, options), 'expected loose witness satisfies')
    const min = semver.minVersion(range, options)
    t.equal(min && min.version, expected)
    t.type(min, semver.SemVer)
  })
  t.throws(() => semver.minVersion(range), TypeError)
  t.end()
})

test('minimum version preserves Range comparator state across repeated calls', (t) => {
  const range = new semver.Range('>0.0.0 <=0.0.1-0')
  const expected = '0.0.1-0'
  const before = JSON.stringify(range.set)
  const versions = range.set[0].map(comparator => comparator.semver)
  const prereleases = versions.map(version => version.prerelease)
  t.ok(semver.satisfies(expected, range), 'expected Range witness satisfies')
  for (let i = 0; i < 3; i++) {
    const min = semver.minVersion(range)
    t.equal(min && min.version, expected)
    t.type(min, semver.SemVer)
    t.match(min, { version: expected, raw: expected })
    t.equal(JSON.stringify(range.set), before, 'comparator values stay unchanged')
    range.set[0].forEach((comparator, index) => {
      t.equal(comparator.semver, versions[index], 'comparator version identity stays unchanged')
      t.equal(comparator.semver.prerelease, prereleases[index], 'prerelease array stays unchanged')
    })
  }
  t.end()
})

test('minimum version retains invalid input errors', (t) => {
  t.throws(() => semver.minVersion('not a range'), TypeError)
  t.throws(() => semver.minVersion(null), TypeError)
  t.end()
})

const assertRepairMinimum = (t, range, expected, ...options) => {
  t.ok(semver.satisfies(expected, range, ...options), `${expected} satisfies ${range}`)
  const min = semver.minVersion(range, ...options)
  t.equal(min && min.version, expected, `minimum of ${range}`)
  t.type(min, semver.SemVer)
  t.match(min, { version: expected, raw: expected })
}

test('invalid adjusted minima cannot displace another branch minimum', (t) => {
  [
    ['>1.2.3 <1.2.4-0', '>=1.2.4', '1.2.4'],
    ['>1.2.3 <1.2.4-0', '>=1.2.4-alpha', '1.2.4-alpha'],
    ['>1.2.3 <1.2.4-0', '>1.2.4-alpha', '1.2.4-alpha.0'],
    ['>0.0.0 <0.0.1-0', '>=0.0.1', '0.0.1'],
    ['>0.0.0 <0.0.1-0', '>0.0.1-alpha', '0.0.1-alpha.0'],
  ].forEach(([invalid, alternative, expected]) => {
    [[], [false], [{ includePrerelease: false }], [{ includePrerelease: true }]]
      .forEach((options) => {
        [`${invalid} || ${alternative}`, `${alternative} || ${invalid}`].forEach((range) => {
          assertRepairMinimum(t, range, expected, ...options)
        })
      })
  })
  t.end()
})

test('adjusted branch admission respects loose parsing', (t) => {
  [
    ['>=01.02.04', '1.2.4'],
    ['>01.02.04-alpha', '1.2.4-alpha.0'],
  ].forEach(([alternative, expected]) => {
    const invalid = '>01.02.03 <01.02.04-0'
    ;[`${invalid} || ${alternative}`, `${alternative} || ${invalid}`].forEach((range) => {
      [true, { loose: true }].forEach((options) => {
        assertRepairMinimum(t, range, expected, options)
      })
      t.throws(() => semver.minVersion(range), TypeError)
    })
  })
  t.end()
})

test('branch admission validates the completed adjusted minimum', (t) => {
  [
    ['<1.2.4-0 >1.2.3', '>=1.2.4', '1.2.4'],
    ['<1.2.4-0 >1.2.3', '>1.2.4-alpha', '1.2.4-alpha.0'],
    ['>1.2.3 >1.2.4-alpha <=1.2.4-alpha', '>=1.2.4', '1.2.4'],
    ['>1.2.3 >=1.2.4-beta <1.2.4-beta', '>=1.2.4', '1.2.4'],
    ['>1.2.3 1.2.4-beta <1.2.4-beta', '>=1.2.4', '1.2.4'],
    ['>1.2.3 <=1.2.4-0', '>=1.2.4', '1.2.4-0'],
    ['>1.2.3 <1.2.4-0', '>1.2.3 >=1.2.4-alpha <=1.2.4-beta', '1.2.4-alpha'],
    ['>1.2.3 <1.2.4-0', '>=2.0.0 || >=1.2.4', '1.2.4'],
  ].forEach(([left, right, expected]) => {
    [[], [{ includePrerelease: true }]].forEach((options) => {
      [`${left} || ${right}`, `${right} || ${left}`].forEach((range) => {
        assertRepairMinimum(t, range, expected, ...options)
      })
    })
  })
  assertRepairMinimum(t, '>=1.2.4 || >=2.0.0 || >1.2.3 <1.2.4-0', '1.2.4')
  t.end()
})

test('impossible adjusted branches still have no minimum', (t) => {
  [
    ['>1.2.3 <1.2.4-0', '1.2.4-0'],
    ['<1.2.4-0 >1.2.3', '1.2.4-0'],
    ['>0.0.0 <0.0.1-0', '0.0.1-0'],
    ['>1.2.3 >1.2.4-alpha <=1.2.4-alpha', '1.2.4-alpha.0'],
    ['>1.2.3 >=1.2.4-beta <1.2.4-beta', '1.2.4-beta'],
    ['>1.2.3 1.2.4-beta <1.2.4-beta', '1.2.4-beta'],
    ['>1.2.3 <1.2.4-0 || >0.0.0 <0.0.1-0', '1.2.4-0'],
    ['>0.0.0 <0.0.1-0 || >1.2.3 <1.2.4-0', '0.0.1-0'],
  ].forEach(([range, excluded]) => {
    [[], [{ includePrerelease: true }]].forEach((options) => {
      t.notOk(semver.satisfies(excluded, range, ...options), `${excluded} is excluded by ${range}`)
      t.equal(semver.minVersion(range, ...options), null, `no minimum for ${range}`)
    })
  })
  t.end()
})

test('unadjusted final candidates retain union selection behavior', (t) => {
  [
    '>=1.2.4-0 <1.2.4-0',
    '>1.2.2 >=1.2.3-0 >=1.2.4-0 <1.2.4-0',
    '>1.1.3 >=1.1.4-0 >=1.2.4-0 <1.2.4-0',
    '>0.2.3 >=0.2.4-0 >=1.2.4-0 <1.2.4-0',
  ].forEach((left) => {
    [`${left} || >1.2.3`, `>1.2.3 || ${left}`].forEach((range) => {
      assertRepairMinimum(t, range, '1.2.4-0', { includePrerelease: true })
    })
  })
  t.end()
})

test('adjusted branch admission preserves wildcard and early zero minima', (t) => {
  [
    ['*', '0.0.0'],
    ['>1.2.3 <1.2.4-0 || *', '0.0.0'],
    ['* || >1.2.3 <1.2.4-0', '0.0.0'],
    ['<0.0.0-beta', '0.0.0-0'],
  ].forEach(([range, expected]) => {
    assertRepairMinimum(t, range, expected)
  })
  t.end()
})

const assertBranchState = (t, range, before, versions, prereleases) => {
  t.equal(JSON.stringify(range.set), before, 'all comparator values stay unchanged')
  range.set.forEach((comparators, branch) => {
    comparators.forEach((comparator, index) => {
      t.equal(comparator.semver, versions[branch][index], 'all version identities stay unchanged')
      t.equal(comparator.semver.prerelease, prereleases[branch][index],
        'all prerelease array identities stay unchanged')
    })
  })
}

test('adjusted OR minima preserve every Range branch across repeated calls', (t) => {
  [
    ['>1.2.3 <1.2.4-0', '>=1.2.4', '1.2.4', []],
    ['>1.2.3 <1.2.4-0', '>1.2.4-alpha', '1.2.4-alpha.0', []],
    ['>1.2.3 <1.2.4-0', '>=1.2.4', '1.2.4', [{ includePrerelease: true }]],
    ['>1.2.3 <1.2.4-0', '>1.2.4-alpha', '1.2.4-alpha.0', [{ includePrerelease: true }]],
    ['>=1.2.4-0 <1.2.4-0', '>1.2.3', '1.2.4-0', [{ includePrerelease: true }]],
  ].forEach(([left, right, expected, options]) => {
    [`${left} || ${right}`, `${right} || ${left}`].forEach((input) => {
      const range = new semver.Range(input, ...options)
      const before = JSON.stringify(range.set)
      const versions = range.set.map(comparators =>
        comparators.map(comparator => comparator.semver))
      const prereleases = versions.map(branch => branch.map(version => version.prerelease))
      for (let i = 0; i < 3; i++) {
        assertRepairMinimum(t, range, expected, ...options)
        assertBranchState(t, range, before, versions, prereleases)
      }
    })
  })
  t.end()
})
