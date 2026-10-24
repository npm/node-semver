'use strict'

const simplify = require('../../ranges/simplify.js')
const Range = require('../../classes/range.js')
const satisfies = require('../../functions/satisfies.js')
const t = require('tap')
const versions = [
  '1.0.0',
  '1.0.1',
  '1.0.2',
  '1.0.3',
  '1.0.4',
  '1.1.0',
  '1.1.1',
  '1.1.2',
  '1.2.0',
  '1.2.1',
  '1.2.2',
  '1.2.3',
  '1.2.4',
  '1.2.5',
  '2.0.0',
  '2.0.1',
  '2.1.0',
  '2.1.1',
  '2.1.2',
  '2.2.0',
  '2.2.1',
  '2.2.2',
  '2.3.0',
  '2.3.1',
  '2.4.0',
  '3.0.0',
  '3.1.0',
  '3.2.0',
  '3.3.0',
]

t.equal(simplify(versions, '1.x'), '1.x')
t.equal(simplify(versions, '1.0.0 || 1.0.1 || 1.0.2 || 1.0.3 || 1.0.4'), '<=1.0.4')
t.equal(simplify(versions, new Range('1.0.0 || 1.0.1 || 1.0.2 || 1.0.3 || 1.0.4')), '<=1.0.4')
t.equal(simplify(versions, '>=3.0.0 <3.1.0'), '3.0.0')
t.equal(simplify(versions, '3.0.0 || 3.1 || 3.2 || 3.3'), '>=3.0.0')
t.equal(simplify(versions, '1 || 2 || 3'), '*')
t.equal(simplify(versions, '2.1 || 2.2 || 2.3'), '2.1.0 - 2.3.1')

t.test('preserves prerelease membership when simplifying bounds', t => {
  const cases = [
    [
      ['1.0.0-alpha', '1.0.0-beta', '1.0.0'],
      '>=1.0.0-alpha <2.0.0',
      '*',
    ],
    [
      ['1.0.0-alpha', '1.0.0', '2.0.0'],
      '>=1.0.0-alpha <2.0.0',
      '<=1.0.0',
    ],
    [
      ['0.0.0', '1.0.0-alpha', '1.1.0-alpha'],
      '1.0.0-alpha || 1.1.0-alpha',
      '>=1.0.0-alpha',
    ],
    [
      ['0.0.0', '1.0.0-alpha', '1.1.0-alpha', '1.2.0-alpha', '2.0.0'],
      '1.0.0-alpha || 1.1.0-alpha || 1.2.0-alpha',
      '1.0.0-alpha - 1.2.0-alpha',
    ],
  ]

  for (const [suppliedVersions, source, withPrereleases] of cases) {
    for (const range of [source, new Range(source)]) {
      const simplified = simplify(suppliedVersions, range)
      t.equal(simplified, range, `preserves the original instead of ${withPrereleases}`)
      t.same(
        suppliedVersions.filter(v => satisfies(v, simplified)),
        suppliedVersions.filter(v => satisfies(v, range)),
        'matches the same supplied versions'
      )
    }

    const options = { includePrerelease: true }
    const simplified = simplify(suppliedVersions, source, options)
    t.equal(simplified, withPrereleases, 'still simplifies with includePrerelease')
    t.same(
      suppliedVersions.filter(v => satisfies(v, simplified, options)),
      suppliedVersions.filter(v => satisfies(v, source, options)),
      'matches the same supplied versions with includePrerelease'
    )
  }
  t.end()
})

t.test('still simplifies when prerelease membership is unchanged', t => {
  t.equal(
    simplify(['1.0.0-alpha', '1.0.0-beta', '2.0.0'], '>=1.0.0-alpha <2.0.0'),
    '<=1.0.0-beta',
    'preserves matching prereleases with the same tuple as the upper bound'
  )
  t.equal(
    simplify(['1.0.0-alpha', '1.0.0', '1.1.0'], '^1.0.0 || ^2.0.0'),
    '>=1.0.0',
    'preserves excluded prereleases'
  )
  t.end()
})
