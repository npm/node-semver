const t = require('tap')
const preload = require('../preload.js')
const index = require('../index.js')
t.equal(preload, index, 'preload and index match')
