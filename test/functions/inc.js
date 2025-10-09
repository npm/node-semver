'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const inc = require('../../functions/inc')
const parse = require('../../functions/parse')
const increments = require('../fixtures/increments.js')

test('increment versions test', () => {
  increments.forEach(([pre, what, wanted, options, id, base]) => {
    const found = inc(pre, what, options, id, base)
    const cmd = `inc(${pre}, ${what}, ${id}, ${base})`
    a.equal(found, wanted, `${cmd} === ${wanted}`)

    const parsed = parse(pre, options)
    const parsedAsInput = parse(pre, options)
    if (wanted) {
      parsed.inc(what, id, base)
      a.equal(parsed.version, wanted, `${cmd} object version updated`)
      if (parsed.build.length) {
        a.equal(
          parsed.raw,
          `${wanted}+${parsed.build.join('.')}`,
          `${cmd} object raw field updated with build`
        )
      } else {
        a.equal(parsed.raw, wanted, `${cmd} object raw field updated`)
      }

      const preIncObject = JSON.stringify(parsedAsInput)
      inc(parsedAsInput, what, options, id, base)
      const postIncObject = JSON.stringify(parsedAsInput)
      a.equal(
        postIncObject,
        preIncObject,
        `${cmd} didn't modify its input`
      )
    } else if (parsed) {
      a.throws(() => {
        parsed.inc(what, id, base)
      })
    } else {
      a.equal(parsed, null)
    }
  })
})
