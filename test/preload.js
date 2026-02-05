'use strict'

const t = require('tap')
const preload = require('semver/preload')
const index = require('semver')
t.equal(preload, index, 'preload and index match')
