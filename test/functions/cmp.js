const { test } = require('tap')
const cmp = require('../../functions/cmp')

test('invalid cmp usage', (t) => {
    t.throws(() => {
      cmp('1.2.3', 'a frog', '4.5.6')
    }, new TypeError('Invalid operator: a frog'))
    t.end()
  })