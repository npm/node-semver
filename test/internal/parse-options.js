'use strict'

const t = require('node:test')
const a = require('node:assert')
const parseOptions = require('../../internal/parse-options.js')

t.test('falsey values always empty options object', () => {
  a.deepEqual(parseOptions(null), {})
  a.deepEqual(parseOptions(false), {})
  a.deepEqual(parseOptions(undefined), {})
  a.deepEqual(parseOptions(), {})
  a.deepEqual(parseOptions(0), {})
  a.deepEqual(parseOptions(''), {})
})

t.test('truthy non-objects always loose mode, for backwards comp', () => {
  a.deepEqual(parseOptions('hello'), { loose: true })
  a.deepEqual(parseOptions(true), { loose: true })
  a.deepEqual(parseOptions(1), { loose: true })
})

t.test('any object passed is returned', () => {
  a.deepEqual(parseOptions(/asdf/), /asdf/)
  a.deepEqual(parseOptions(new Error('hello')), new Error('hello'))
  a.deepEqual(parseOptions({ loose: true, a: 1, rtl: false }), { loose: true, a: 1, rtl: false })
  a.deepEqual(parseOptions({ loose: 1, rtl: 2, includePrerelease: 10 }), {
    loose: 1,
    rtl: 2,
    includePrerelease: 10,
  })
  a.deepEqual(parseOptions({ loose: true }), { loose: true })
  a.deepEqual(parseOptions({ rtl: true }), { rtl: true })
  a.deepEqual(parseOptions({ includePrerelease: true }), { includePrerelease: true })
  a.deepEqual(parseOptions({ loose: true, rtl: true }), { loose: true, rtl: true })
  a.deepEqual(parseOptions({ loose: true, includePrerelease: true }), {
    loose: true,
    includePrerelease: true,
  })
  a.deepEqual(parseOptions({ rtl: true, includePrerelease: true }), {
    rtl: true,
    includePrerelease: true,
  })
})
