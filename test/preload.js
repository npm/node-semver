const t = require('node:test')
const a = require('node:assert')
const preload = require('../preload.js')
const index = require('../index.js')
t.test('preload and index', (t) => {
  a.equal(preload, index, 'preload and index match')
})
