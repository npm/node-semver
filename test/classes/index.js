'use strict'

const exported = require('../../classes/index.js')
const SemVer = require('../../classes/semver.js')
const Range = require('../../classes/range.js')
const Comparator = require('../../classes/comparator.js')

const t = require('tap')
t.same(exported, {
  SemVer,
  Range,
  Comparator,
}, 'export all classes at semver/classes')
