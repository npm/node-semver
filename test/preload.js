'use strict'

const a = require('node:assert')
const preload = require('../preload.js')
const index = require('../index.js')
a.equal(preload, index, 'preload and index match')
