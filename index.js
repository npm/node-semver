var SemVer = require('./semver');
var { compareIdentifiers, rcompareIdentifiers } = require('./internal/identifiers');
var { SEMVER_SPEC_VERSION } = require('./internal/constants');
var { re, src, t } = require('./internal/re');

exports = module.exports = SemVer
exports.re = re;
exports.src = src;
exports.tokens = t;
exports.SEMVER_SPEC_VERSION = SEMVER_SPEC_VERSION;

exports.SemVer = SemVer
exports.compareIdentifiers = compareIdentifiers
exports.rcompareIdentifiers = rcompareIdentifiers

exports.parse = parse = require('./functions/parse');
exports.valid = valid = require('./functions/valid');
exports.clean = clean = require('./functions/clean');
exports.inc = inc = require('./functions/inc');
exports.diff = diff = require('./functions/diff');
exports.major = major = require('./functions/major');
exports.minor = minor = require('./functions/minor');
exports.patch = patch = require('./functions/patch');
exports.prerelease = prerelease = require('./functions/prerelease');
exports.compare = compare = require('./functions/compare');
exports.rcompare = rcompare = require('./functions/rcompare');
exports.compareLoose = compareLoose = require('./functions/compare-loose');
exports.compareBuild = compareBuild = require('./functions/compare-build');
exports.sort = sort = require('./functions/sort');
exports.rsort = rsort = require('./functions/rsort');
exports.gt = gt = require('./functions/gt');
exports.lt = lt = require('./functions/lt');
exports.eq = eq = require('./functions/eq');
exports.neq = neq = require('./functions/neq');
exports.gte = gte = require('./functions/gte');
exports.lte = lte = require('./functions/lte');
exports.cmp = cmp = require('./functions/cmp');
exports.coerce = coerce = require('./functions/coerce');

var { Comparator, Range, satisfies} = require('./ranges');
exports.Comparator = Comparator;
exports.Range = Range;
exports.satisfies = satisfies;

exports.toComparators = toComparators = require('./ranges/to-comparators');
exports.maxSatisfying = maxSatisfying = require('./ranges/max-satisfying');
exports.minSatisfying = minSatisfying = require('./ranges/min-satisfying');
exports.minVersion = minVersion = require('./ranges/min-version');
exports.validRange = validRange = require('./ranges/valid-range');
exports.outside = outside = require('./ranges/outside');
exports.gtr = gtr = require('./ranges/gtr');
exports.ltr = ltr = require('./ranges/ltr');
exports.intersects = intersects = require('./ranges/intersects');
