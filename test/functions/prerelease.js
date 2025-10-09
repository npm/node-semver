'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const prerelease = require('../../functions/prerelease')

test('prerelease', () => {
  // [prereleaseParts, version, loose]
  [
    [['alpha', 1], '1.2.2-alpha.1'],
    [[1], '0.6.1-1'],
    [['beta', 2], '1.0.0-beta.2'],
    [['pre'], 'v0.5.4-pre'],
    [['alpha', 1], '1.2.2-alpha.1', false],
    [['beta'], '0.6.1beta', true],
    [null, '1.0.0', true],
    [null, '~2.0.0-alpha.1', false],
    [null, 'invalid version'],
  ].forEach((tuple) => {
    const expected = tuple[0]
    const version = tuple[1]
    const loose = tuple[2]
    const msg = `prerelease(${version})`
    a.deepEqual(prerelease(version, loose), expected, msg)
  })
})
