const t = require('tap')
const parseOptions = require('../../internal/parse-options.js')

t.test('falsey values always empty options object', t => {
  t.strictSame(parseOptions(null), {})
  t.strictSame(parseOptions(false), {})
  t.strictSame(parseOptions(undefined), {})
  t.strictSame(parseOptions(), {})
  t.strictSame(parseOptions(0), {})
  t.strictSame(parseOptions(''), {})
  t.end()
})

t.test('truthy non-objects always loose mode, for backwards comp', t => {
  t.strictSame(parseOptions('hello'), { loose: true })
  t.strictSame(parseOptions(true), { loose: true })
  t.strictSame(parseOptions(1), { loose: true })
  t.end()
})

t.test('objects only include truthy flags we know about, set to true', t => {
  t.strictSame(parseOptions(/asdf/), {})
  t.strictSame(parseOptions(new Error('hello')), {})
  t.strictSame(parseOptions({ loose: true, a: 1, rtl: false }), { loose: true })
  t.strictSame(parseOptions({ loose: 1, rtl: 2, includePrerelease: 10 }), {
    loose: true,
    rtl: true,
    includePrerelease: true,
  })
  t.strictSame(parseOptions({ loose: true }), { loose: true })
  t.strictSame(parseOptions({ rtl: true }), { rtl: true })
  t.strictSame(parseOptions({ includePrerelease: true }), { includePrerelease: true })
  t.strictSame(parseOptions({ loose: true, rtl: true }), { loose: true, rtl: true })
  t.strictSame(parseOptions({ loose: true, includePrerelease: true }), { loose: true, includePrerelease: true })
  t.strictSame(parseOptions({ rtl: true, includePrerelease: true }), { rtl: true, includePrerelease: true })
  t.end()
})

t.test('should skip validation when options is already parsed', t => {
  const options = { loose: true, rtl: true }
  const parsedOptions = parseOptions(options)

  t.equal(parseOptions(parsedOptions) === parsedOptions, true)
  t.not(parseOptions(options) === parsedOptions, false)
  t.end()
})
