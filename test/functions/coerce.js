const t = require('node:test')
const a = require('node:assert')
const coerce = require('../../functions/coerce')
const parse = require('../../functions/parse')
const valid = require('../../functions/valid')

const coerceToNull = require('../fixtures/coerce-to-null')
const coerceToValid = require('../fixtures/coerce-to-valid')

t.test('coerce tests', async (t) => {
  await t.test('coerce to null', t => {
    for (const input of coerceToNull) {
      a.equal(coerce(input), null, `coerce(${input}) should be null`)
    }
  })
  await t.test('coerce to valid', t => {
    for (const [input, expected, options] of coerceToValid) {
      a.equal((coerce(input, options) || {}).version, expected,
        `coerce(${input}) should become ${expected}`)
    }
    a.equal(coerce(parse('1.2.3')), '1.2.3', 'parsed results coerce cleanly')
    a.equal(valid(coerce('42.6.7.9.3-alpha')), '42.6.7')
    a.equal(valid(coerce('v2')), '2.0.0')
  })
})
