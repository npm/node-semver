const t = require('node:test')
const a = require('node:assert')

const minVersion = require('../../ranges/min-version')

const versions = require('../fixtures/min-version')

t.test('minimum version in range tests', (t) => {
  for (const [range, version] of versions) {
    const msg = `minVersion(${range}) = ${version}`
    const min = minVersion(range)
    a.ok(min === version || (min && min.version === version), msg, {
      found: min,
      wanted: version,
    })
  }
})
