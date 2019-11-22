const { test } = require('tap')
const inc = require('../../functions/inc')
const parse = require('../../functions/parse')
const increments = require('../fixtures/increments.js')

test('increment versions test', (t) => {
  increments.forEach(([pre, what, wanted, options, id]) => {
    const found = inc(pre, what, options, id)
    const cmd = `inc(${pre}, ${what}, ${id})`
    t.equal(found, wanted, `${cmd} === ${wanted}`)

    const parsed = parse(pre, options)
    if (wanted) {
      parsed.inc(what, id)
      t.equal(parsed.version, wanted, `${cmd} object version updated`)
      t.equal(parsed.raw, wanted, `${cmd} object raw field updated`)
    } else if (parsed) {
      t.throws(() => {
        parsed.inc(what, id)
      })
    } else {
      t.equal(parsed, null)
    }
  })

  t.end()
})
