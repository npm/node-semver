const { test } = require('tap')
const outside = require('../../ranges/outside')

test('outside with bad hilo throws', (t) => {
    t.throws(() => {
      outside('1.2.3', '>1.5.0', 'blerg', true)
    }, new TypeError('Must provide a hilo val of "<" or ">"'))
    t.end()
  })
  