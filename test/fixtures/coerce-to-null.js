// Expected to be null (cannot be coerced).
module.exports = [
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
