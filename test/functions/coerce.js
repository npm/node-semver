const { test } = require('tap')
const coerce = require('../../functions/coerce')
const parse = require('../../functions/parse')
const valid = require('../../functions/valid')

test('coerce tests', (t) => {
  // Expected to be null (cannot be coerced).
  const coerceToNull = [
    null,
    { version: '1.2.3' },
    function () {
      return '1.2.3'
    },
    '',
    '.',
    'version one',
    '9'.repeat(16),
    '1'.repeat(17),
    `a${'9'.repeat(16)}`,
    `a${'1'.repeat(17)}`,
    `${'9'.repeat(16)}a`,
    `${'1'.repeat(17)}a`,
    `${'9'.repeat(16)}.4.7.4`,
    `${'9'.repeat(16)}.${'2'.repeat(16)}.${'3'.repeat(16)}`,
    `${'1'.repeat(16)}.${'9'.repeat(16)}.${'3'.repeat(16)}`,
    `${'1'.repeat(16)}.${'2'.repeat(16)}.${'9'.repeat(16)}`,
  ]
  coerceToNull.forEach((input) => {
    const msg = `coerce(${input}) should be null`
    t.same(coerce(input), null, msg)
  })

  // Expected to be valid.
  const coerceToValid = [
    [parse('1.2.3'), '1.2.3'],
    ['.1', '1.0.0'],
    ['.1.', '1.0.0'],
    ['..1', '1.0.0'],
    ['.1.1', '1.1.0'],
    ['1.', '1.0.0'],
    ['1.0', '1.0.0'],
    ['1.0.0', '1.0.0'],
    ['0', '0.0.0'],
    ['0.0', '0.0.0'],
    ['0.0.0', '0.0.0'],
    ['0.1', '0.1.0'],
    ['0.0.1', '0.0.1'],
    ['0.1.1', '0.1.1'],
    ['1', '1.0.0'],
    ['1.2', '1.2.0'],
    ['1.2.3', '1.2.3'],
    ['1.2.3.4', '1.2.3'],
    ['13', '13.0.0'],
    ['35.12', '35.12.0'],
    ['35.12.18', '35.12.18'],
    ['35.12.18.24', '35.12.18'],
    ['v1', '1.0.0'],
    ['v1.2', '1.2.0'],
    ['v1.2.3', '1.2.3'],
    ['v1.2.3.4', '1.2.3'],
    [' 1', '1.0.0'],
    ['1 ', '1.0.0'],
    ['1 0', '1.0.0'],
    ['1 1', '1.0.0'],
    ['1.1 1', '1.1.0'],
    ['1.1-1', '1.1.0'],
    ['1.1-1', '1.1.0'],
    ['a1', '1.0.0'],
    ['a1a', '1.0.0'],
    ['1a', '1.0.0'],
    ['version 1', '1.0.0'],
    ['version1', '1.0.0'],
    ['version1.0', '1.0.0'],
    ['version1.1', '1.1.0'],
    ['42.6.7.9.3-alpha', '42.6.7'],
    ['v2', '2.0.0'],
    ['v3.4 replaces v3.3.1', '3.4.0'],
    ['4.6.3.9.2-alpha2', '4.6.3'],
    [`${'1'.repeat(17)}.2`, '2.0.0'],
    [`${'1'.repeat(17)}.2.3`, '2.3.0'],
    [`1.${'2'.repeat(17)}.3`, '1.0.0'],
    [`1.2.${'3'.repeat(17)}`, '1.2.0'],
    [`${'1'.repeat(17)}.2.3.4`, '2.3.4'],
    [`1.${'2'.repeat(17)}.3.4`, '1.0.0'],
    [`1.2.${'3'.repeat(17)}.4`, '1.2.0'],
    [`${'1'.repeat(17)}.${'2'.repeat(16)}.${'3'.repeat(16)}`,
      `${'2'.repeat(16)}.${'3'.repeat(16)}.0`],
    [`${'1'.repeat(16)}.${'2'.repeat(17)}.${'3'.repeat(16)}`,
      `${'1'.repeat(16)}.0.0`],
    [`${'1'.repeat(16)}.${'2'.repeat(16)}.${'3'.repeat(17)}`,
      `${'1'.repeat(16)}.${'2'.repeat(16)}.0`],
    [`11${'.1'.repeat(126)}`, '11.1.1'],
    ['1'.repeat(16), `${'1'.repeat(16)}.0.0`],
    [`a${'1'.repeat(16)}`, `${'1'.repeat(16)}.0.0`],
    [`${'1'.repeat(16)}.2.3.4`, `${'1'.repeat(16)}.2.3`],
    [`1.${'2'.repeat(16)}.3.4`, `1.${'2'.repeat(16)}.3`],
    [`1.2.${'3'.repeat(16)}.4`, `1.2.${'3'.repeat(16)}`],
    [`${'1'.repeat(16)}.${'2'.repeat(16)}.${'3'.repeat(16)}`,
      `${'1'.repeat(16)}.${'2'.repeat(16)}.${'3'.repeat(16)}`],
    [`1.2.3.${'4'.repeat(252)}.5`, '1.2.3'],
    [`1.2.3.${'4'.repeat(1024)}`, '1.2.3'],
    [`${'1'.repeat(17)}.4.7.4`, '4.7.4'],
    [10, '10.0.0'],
    ['1.2.3/a/b/c/2.3.4', '2.3.4', { rtl: true }],
    ['1.2.3.4.5.6', '4.5.6', { rtl: true }],
    ['1.2.3.4.5/6', '6.0.0', { rtl: true }],
    ['1.2.3.4./6', '6.0.0', { rtl: true }],
    ['1.2.3.4/6', '6.0.0', { rtl: true }],
    ['1.2.3./6', '6.0.0', { rtl: true }],
    ['1.2.3/6', '6.0.0', { rtl: true }],
    ['1.2.3.4', '2.3.4', { rtl: true }],
    ['1.2.3.4xyz', '2.3.4', { rtl: true }],

    ['1-rc.5', '1.0.0-rc.5', { includePrerelease: true }],
    ['1.2-rc.5', '1.2.0-rc.5', { includePrerelease: true }],
    ['1.2.3-rc.5', '1.2.3-rc.5', { includePrerelease: true }],
    ['1.2.3-rc.5/a', '1.2.3-rc.5', { includePrerelease: true }],
    ['1.2.3.4-rc.5', '1.2.3', { includePrerelease: true }],
    ['1.2.3.4+rev.6', '1.2.3', { includePrerelease: true }],

    ['1.0.0-1a', '1.0.0-1a', { includePrerelease: true }],
    ['1.0.0-alpha.12ab', '1.0.0-alpha.12ab', { includePrerelease: true }],
    ['1.0.0-alpha.1234.23cd', '1.0.0-alpha.1234.23cd', { includePrerelease: true }],
    ['1.0.0-nightly.abc123', '1.0.0-nightly.abc123', { includePrerelease: true }],
    ['1.0.0-nightly.abcdef', '1.0.0-nightly.abcdef', { includePrerelease: true }],
    ['1.0.0-nightly.123456', '1.0.0-nightly.123456', { includePrerelease: true }],

    ['1+rev.6', '1.0.0+rev.6', { includePrerelease: true }],
    ['1.2+rev.6', '1.2.0+rev.6', { includePrerelease: true }],
    ['1.2.3+rev.6', '1.2.3+rev.6', { includePrerelease: true }],
    ['1.2.3+rev.6/a', '1.2.3+rev.6', { includePrerelease: true }],
    ['1.2.3.4-rc.5', '1.2.3', { includePrerelease: true }],
    ['1.2.3.4+rev.6', '1.2.3', { includePrerelease: true }],

    ['1-rc.5+rev.6', '1.0.0-rc.5+rev.6', { includePrerelease: true }],
    ['1.2-rc.5+rev.6', '1.2.0-rc.5+rev.6', { includePrerelease: true }],
    ['1.2.3-rc.5+rev.6', '1.2.3-rc.5+rev.6', { includePrerelease: true }],
    ['1.2.3-rc.5+rev.6/a', '1.2.3-rc.5+rev.6', { includePrerelease: true }],

    ['1.2-rc.5+rev.6', '1.2.0-rc.5+rev.6', { rtl: true, includePrerelease: true }],
    ['1.2.3-rc.5+rev.6', '1.2.3-rc.5+rev.6', { rtl: true, includePrerelease: true }],
    ['1.2.3.4-rc.5+rev.6', '2.3.4-rc.5+rev.6', { rtl: true, includePrerelease: true }],
    ['1.2.3.4-rc.5', '2.3.4-rc.5', { rtl: true, includePrerelease: true }],
    ['1.2.3.4+rev.6', '2.3.4+rev.6', { rtl: true, includePrerelease: true }],
    ['1.2.3.4-rc.5+rev.6/7', '7.0.0', { rtl: true, includePrerelease: true }],
    ['1.2.3.4-rc/7.5+rev.6', '7.5.0+rev.6', { rtl: true, includePrerelease: true }],
    ['1.2.3.4/7-rc.5+rev.6', '7.0.0-rc.5+rev.6', { rtl: true, includePrerelease: true }],
  ]
  coerceToValid.forEach(([input, expected, options]) => {
    const coerceExpression = `coerce(${input}, ${JSON.stringify(options)})`
    const coercedVersion = coerce(input, options) || {}
    const expectedVersion = parse(expected)
    t.equal(expectedVersion.compare(coercedVersion), 0,
      `${coerceExpression} should be equal to ${expectedVersion}`)
    t.equal(expectedVersion.compareBuild(coercedVersion), 0,
      `${coerceExpression} build should be equal to ${expectedVersion}`)
  })

  t.same(valid(coerce('42.6.7.9.3-alpha')), '42.6.7')
  t.same(valid(coerce('42.6.7-alpha+rev.1', { includePrerelease: true })), '42.6.7-alpha')
  t.same(valid(coerce('v2')), '2.0.0')

  t.end()
})
