// test/esm/test-exports.mjs
import {createRequire} from 'module'
import t from 'tap'

import * as semver from 'semver'

const require = createRequire(import.meta.url)

const cjs = require('semver')

t.equal(cjs, semver.default)
t.same(cjs, Object.fromEntries(Object.entries(semver).filter(nvp => nvp[0] !== 'default')))
