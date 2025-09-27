'use strict'

const { test } = require('tap')
const Range = require('../../classes/range')

test('Build metadata is allowed and ignored for X-ranges and partials', t => {
  const buildCases = [
    '1.x.x+build >2.x+build',
    '>=1.x+build <2.x.x+build',
    '1.x.x+build || 2.x.x+build',
    '1.x+build.123',
    '1.x.x+meta-data',
    '1.x.x+build.123 >2.x.x+meta-data',
    '1.x.x+build <2.x.x+meta',
    '>1.x+build <=2.x.x+meta',
    ' 1.x.x+build   >2.x.x+build  ',
    '^1.x+build',
    '^1.x.x+build',
    '^1.2.x+build',
    '^1.x+meta-data',
    '^1.x.x+build.123',
    '~1.x+build',
    '~1.x.x+build',
    '~1.2.x+build',
    '~1.x+meta-data',
    '~1.x.x+build.123',
    '^1.x.x+build || ~2.x.x+meta',
    '~1.x.x+build >2.x+meta',
    '^1.x+build.123 <2.x.x+meta-data',
  ]
  t.plan(buildCases.length)
  buildCases.forEach(range => {
    t.doesNotThrow(() => new Range(range), `${range} should not throw`)
  })
  t.end()
})

test('Build metadata with prerelease in X-ranges/partials', t => {
  const cases = [
    '1.x.x-alpha+build',
    '>1.x.x-alpha+build',
    '>=1.x.x-alpha+build <2.x.x+build',
    '1.x.x-alpha+build || 2.x.x+build',
  ]
  t.plan(cases.length)
  cases.forEach(range => {
    t.doesNotThrow(() => new Range(range), TypeError, `${range} should not throw`)
  })
  t.end()
})
