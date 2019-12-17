const t = require('tap')
const preload = require('../preload.js')
const index = require('../index.js')
t.strictSame(preload, index, 'preload and index match')
