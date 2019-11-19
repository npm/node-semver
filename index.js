const SemVer = require('./classes/semver')
const { Comparator, Range, satisfies} = require('./classes/range')
const { compareIdentifiers, rcompareIdentifiers } = require('./internal/identifiers')
const { SEMVER_SPEC_VERSION } = require('./internal/constants')
const { re, src, t } = require('./internal/re')

exports = module.exports = SemVer
exports.re = re
exports.src = src
exports.tokens = t
exports.SEMVER_SPEC_VERSION = SEMVER_SPEC_VERSION

exports.SemVer = SemVer
exports.compareIdentifiers = compareIdentifiers
exports.rcompareIdentifiers = rcompareIdentifiers

exports.parse = require('./functions/parse')
exports.valid = require('./functions/valid')
exports.clean = require('./functions/clean')
exports.inc = require('./functions/inc')
exports.diff = require('./functions/diff')
exports.major = require('./functions/major')
exports.minor = require('./functions/minor')
exports.patch = require('./functions/patch')
exports.prerelease = require('./functions/prerelease')
exports.compare = require('./functions/compare')
exports.rcompare = require('./functions/rcompare')
exports.compareLoose = require('./functions/compare-loose')
exports.compareBuild = require('./functions/compare-build')
exports.sort = require('./functions/sort')
exports.rsort = require('./functions/rsort')
exports.gt = require('./functions/gt')
exports.lt = require('./functions/lt')
exports.eq = require('./functions/eq')
exports.neq = require('./functions/neq')
exports.gte = require('./functions/gte')
exports.lte = require('./functions/lte')
exports.cmp = require('./functions/cmp')
exports.coerce = require('./functions/coerce')

exports.Comparator = Comparator
exports.Range = Range
exports.satisfies = satisfies

exports.toComparators = require('./ranges/to-comparators')
exports.maxSatisfying = require('./ranges/max-satisfying')
exports.minSatisfying = require('./ranges/min-satisfying')
exports.minVersion = require('./ranges/min-version')
exports.validRange = require('./ranges/valid-range')
exports.outside = require('./ranges/outside')
exports.gtr = require('./ranges/gtr')
exports.ltr = require('./ranges/ltr')
exports.intersects = require('./ranges/intersects')
