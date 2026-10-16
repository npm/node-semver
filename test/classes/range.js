'use strict'

const { test } = require('tap')
const { Range } = require('../../')
const rangeParse = require('../fixtures/range-parse.js')

test('range parsing', t => {
  const assertions = rangeParse.reduce((count, [, expect]) =>
    count + (expect === null ? 1 : 2), 0)
  t.plan(assertions)
  rangeParse.forEach(([range, expect, options]) => {
    const description = `${range} ${JSON.stringify(options)}`
    if (expect === null) {
      t.throws(() => new Range(range, options), TypeError, `invalid range: ${description}`)
    } else {
      const parsed = new Range(range, options)
      t.equal(parsed.range || '*', expect, `${description} => ${expect}`)
      t.equal(parsed.range,
        new Range(expect, { includePrerelease: parsed.includePrerelease }).range,
        `parsing both yields same result: ${description}`)
    }
  })
})

test('range parsing covers every option combination', t => {
  const inputsByOptions = new Map()
  for (const [range, , options] of rangeParse) {
    const loose = !!(options && options.loose)
    const includePrerelease = !!(options && options.includePrerelease)
    const key = `${loose}:${includePrerelease}`
    if (!inputsByOptions.has(key)) {
      inputsByOptions.set(key, [])
    }
    inputsByOptions.get(key).push(range)
  }

  const combinations = ['false:false', 'true:false', 'false:true', 'true:true']
  t.strictSame([...inputsByOptions.keys()], combinations, 'all four modes are present')
  const defaultInputs = inputsByOptions.get('false:false')
  t.equal(defaultInputs.length, 348, 'retains every source fixture row')
  t.equal(new Set(defaultInputs).size, 335, 'retains every distinct source input')
  for (const key of combinations.slice(1)) {
    t.strictSame(inputsByOptions.get(key), defaultInputs, `${key} covers the same inputs`)
  }
  t.end()
})

test('legacy range parsing options', t => {
  const cases = [
    ['>01.02.03', '>1.2.3', true],
    ['>01.02.03', null, false],
    ['>= 1.2.3', '>=1.2.3', null],
    ['1.2.3', '1.2.3', {}],
    ['1.2.3', '1.2.3', { loose: false }],
  ]
  t.plan(cases.length)
  for (const [range, expect, options] of cases) {
    if (expect === null) {
      t.throws(() => new Range(range, options), TypeError, 'strict boolean rejects leading zeros')
    } else {
      t.equal(new Range(range, options).range, expect, JSON.stringify(options))
    }
  }
})
