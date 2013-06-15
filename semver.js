;(function(exports) {

// export the class if we are in a Node-like system.
if (typeof module === 'object' && module.exports === exports)
  exports = module.exports = SemVer;

var debug;
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG))
  debug = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift('SEMVER');
    console.log.apply(console, args);
  };
else
  debug = function() {};

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0';

// The actual regexps go on exports.re
var re = exports.re = {};
var src = exports.src = {};

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

src.numericIdentifier = '0|[1-9]\\d*';


// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

src.nonNumericIdentifier = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


// ## Main Version
// Three dot-separated numeric identifiers.

src.mainVersion = '(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)';


// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

src.prereleaseIdentifier = '(?:0|[1-9]\\d*|\\d*[a-zA-Z-][a-zA-Z0-9-]*)';


// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version identifiers.

src.prerelease = '(?:-(' + src.prereleaseIdentifier +
                 '(?:\\.' + src.prereleaseIdentifier + ')*))';

src.prereleaseLoose = '(?:-?(' + src.prereleaseIdentifier +
                      '(?:\\.' + src.prereleaseIdentifier + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

src.buildIdentifier = '[0-9A-Za-z-]+';


// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

src.build = '(?:\\+(' + src.buildIdentifier +
            '(?:\\.' + src.buildIdentifier + ')*))';


// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

src.full = '^' + src.mainVersion +
           src.prerelease + '?' +
           src.build + '?' +
           '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var loose = '[v=\\s]*' + src.mainVersion +
            '(?:' + src.prereleaseLoose + ')?' +
            '(?:' + src.build + ')?';

src.loose = '^' + loose + '$';

src.gtlt = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
src.xRangeIdentifier = src.numericIdentifier + '|x|X|\\*';
src.xRangePlain = '[v=\\s]*(' + src.xRangeIdentifier + ')' +
                  '(?:\\.(' + src.xRangeIdentifier + ')' +
                  '(?:\\.(' + src.xRangeIdentifier + ')' +
                  '(?:(' + src.prereleaseLoose + ')' +
                  ')?)?)?';

// >=2.x, for example, means >=2.0.0-0
// <1.x would be the same as "<1.0.0-0", though.
src.xRange = '^' + src.gtlt + '\\s*' + src.xRangePlain + '$';

// Tilde ranges.
// Meaning is "reasonably at or greater than"
src.loneTilde = '(?:~>?)';
src.tildeTrim = src.loneTilde + '\s+';
var tildeTrimReplace = '$1';
src.tilde = '^' + src.loneTilde + src.xRangePlain + '$';


// A simple gt/lt/eq thing, or just "" to indicate "any version"
src.comparator = '^' + src.gtlt + '\\s*(' + loose + ')$|^$';


// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
src.comparatorTrim = src.gtlt +
                     '\\s*(' + loose + '|' + src.xRangePlain + ')';

// this one has to use the /g flag
re.comparatorTrim = new RegExp(src.comparatorTrim, 'g');

var comparatorTrimReplace = '$1$2 ';


// Something like `1.2.3 - 1.2.4`
src.hyphenRange = '^\\s*(' + loose + ')' + 
                  '\\s+-\\s+' +
                  '(' + loose + ')' +
                  '\\s*$';
var hyphenReplace = '>=$1 <=$7';

// Star ranges basically just allow anything at all.
src.star = '(<|>)?=?\\s*\\*';

for (var i in src) {
  debug(i, src[i]);
  if (!re[i])
    re[i] = new RegExp(src[i]);
}

exports.valid = exports.parse = parse;
function parse(version) {
  if (!version.match(re.loose))
    return null;
  return new SemVer(version);
}

exports.clean = clean;
function clean(version) {
  return new SemVer(version).version;
}

exports.SemVer = SemVer;

function SemVer(version) {
  if (version instanceof SemVer)
    return version;

  if (!(this instanceof SemVer))
    return new SemVer(version);

  debug('SemVer', version);
  var m = version.match(re.loose);

  if (!m)
    throw new TypeError('Invalid Version: ' + version);

  this.raw = version;
  this.major = m[1];
  this.minor = m[2];
  this.patch = m[3];
  this.prerelease = m[4] ? m[4].split('.') : [];
  this.build = m[5] ? m[5].split('.') : [];
  this.format();
}

SemVer.prototype.format = function() {
  this.version = this.major + '.' + this.minor + '.' + this.patch;
  if (this.prerelease.length)
    this.version += '-' + this.prerelease.join('.');
  return this.version;
}

SemVer.prototype.inspect = function() {
  return '<SemVer "' + this + '">';
};

SemVer.prototype.toString = function() {
  return this.value;
};

SemVer.prototype.compare = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other);

  return this.compareMain(other) || this.comparePre(other);
};

SemVer.prototype.compareMain = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other);

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch);
};

SemVer.prototype.comparePre = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other);

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length)
    return -1;
  else if (!this.prerelease.length && other.prerelease.length)
    return 1;
  else if (!this.prerelease.lenth && !other.prerelease.length)
    return 0;

  var i = 0;
  do {
    var a = this.prerelease[i];
    var b = other.prerelease[i];
    debug('prerelease compare', i, a, b);
    if (a === undefined && b === undefined)
      return 0;
    else if (b === undefined)
      return 1;
    else if (a === undefined)
      return -1;
    else if (a === b)
      continue;
    else
      return compareIdentifiers(a, b);
  } while (++i);
};

SemVer.prototype.inc = function(release) {
  switch (release) {
    case 'major':
      this.major++;
      this.minor = -1;
    case 'minor':
      this.minor++;
      this.patch = -1;
    case 'patch':
      this.patch++;
      this.prerelease = [];
      break;

    default:
      throw new Error('invalid increment argument: '+release);
  }
  this.format();
  return this;
};

exports.inc = inc;
function inc(version, release) {
  try {
    return new SemVer(version).inc(release).version;
  } catch (er) {
    return null;
  }
}

exports.compareIdentifiers = compareIdentifiers;

var numeric = /^[0-9]+$/;
function compareIdentifiers(a, b) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return (anum && !bnum) ? -1
       : (bnum && !anum) ? 1
       : a < b ? -1
       : a > b ? 1
       : 0;
}

exports.rcompareIdentifiers = rcompareIdentifiers;
function rcompareIdentifiers(a, b) {
  return compareIdentifiers(b, a);
}

exports.compare = compare;
function compare(a, b) {
  return new SemVer(a).compare(b);
}

exports.rcompare = rcompare;
function rcompare(a, b) {
  return compare(b, a);
}

exports.sort = sort;
function sort(list) {
  return list.sort(exports.compare);
}

exports.rsort = rsort;
function rsort(list) {
  return list.sort(exports.rcompare);
}

exports.gt = gt;
function gt(a, b) {
  return compare(a, b) > 0;
}

exports.lt = lt;
function lt(a, b) {
  return compare(a, b) < 0;
}

exports.eq = eq;
function eq(a, b) {
  return compare(a, b) === 0;
}

exports.neq = neq;
function neq(a, b) {
  return compare(a, b) !== 0;
}

exports.gte = gte;
function gte(a, b) {
  return compare(a, b) >= 0;
}

exports.lte = lte;
function lte(a, b) {
  return compare(a, b) <= 0;
}

exports.cmp = cmp;
function cmp(a, op, b) {
  var ret;
  switch(op) {
    case '===': ret = a === b; break;
    case '!==': ret = a !== b; break;
    case '': case '=': case '==': ret = eq(a, b); break;
    case '!=': ret = neq(a, b); break;
    case '>': ret = gt(a, b); break;
    case '>=': ret = gte(a, b); break;
    case '<': ret = lt(a, b); break;
    case '<=': ret = lte(a, b); break;
    default: throw new TypeError('Invalid operator: ' + op);
  }
  return ret;
}

exports.Comparator = Comparator;
function Comparator(compString) {
  debug('comparator', compString);
  this.parse(compString);
  if (this.semver === ANY)
    this.value = '';
  else
    this.value = this.operator + this.semver.version;
}

var ANY = {};
Comparator.prototype.parse = function(compString) {
  var m = compString.match(re.comparator);

  if (!m)
    throw new TypeError('Invalid comparator: ' + compString);

  // debug('parsed comparator', m);
  this.operator = m[1];
  if (!m[2])
    this.semver = ANY;
  else {
    this.semver = new SemVer(m[2]);

    // <1.2.3-rc DOES allow 1.2.3-beta (has prerelease)
    // >=1.2.3 DOES NOT allow 1.2.3-beta
    // <=1.2.3 DOES allow 1.2.3-beta
    // However, <1.2.3 does NOT allow 1.2.3-beta,
    // even though `1.2.3-beta < 1.2.3`
    // The assumption is that the 1.2.3 version has something you
    // *don't* want, so we push the prerelease down to the minimum.
    if (this.operator === '<' && !this.semver.prerelease.length) {
      this.semver.prerelease = ['0'];
      this.semver.format();
    }
  }
};

Comparator.prototype.inspect = function() {
  return '<SemVer Comparator "' + this + '">';
};

Comparator.prototype.toString = function() {
  return this.value;
};

Comparator.prototype.test = function(version) {
  return (this.semver === ANY) ? true :
         cmp(version, this.operator, this.semver);
};


exports.Range = Range;
function Range (range) {
  if (range instanceof Range)
    return range;

  if (!(this instanceof Range))
    return new Range(range);

  // First, split based on boolean or ||
  this.raw = range;
  this.set = range.split(/\s*\|\|\s*/).map(function(range) {
    return this.parseRange(range.trim());
  }, this).filter(function(c) {
    // throw out any that are not relevant for whatever reason
    return c.length;
  });

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range);
  }

  this.format();
}

Range.prototype.inspect = function() {
  return '<SemVer Range "' + this.range + '">';
};

Range.prototype.format = function() {
  this.range = this.set.map(function(comps) {
    return comps.join(' ').trim();
  }).join('||').trim();
  return this.range;
};

Range.prototype.toString = function() {
  return this.range;
};

Range.prototype.parseRange = function(range) {
  range = range.trim();
  debug('range', range);
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  range = range.replace(re.hyphenRange, hyphenReplace);
  debug('hyphen replace', range);
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re.comparatorTrim, comparatorTrimReplace);
  debug('comparator trim', range);

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re.tildeTrim, tildeTrimReplace);

  // normalize spaces
  range = range.split(/\s+/).join(' ');

  var set = range.split(' ').map(function(comp) {
    return parseComparator(comp);
  }).join(' ').split(/\s+/).filter(function(comp) {
    // Throw out any that are not valid comparators
    return !!comp.match(re.comparator);
  }).map(function(comp) {
    return new Comparator(comp);
  });

  return set;
};

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators;
function toComparators(range) {
  return new Range(range).set.map(function(comp) {
    return comp.map(function(c) {
      return c.value;
    }).join(' ').trim().split(' ');
  });
}


function parseComparator(comp) {
  // comprised of xranges, tildes, stars, and gtlt's at this point.
  // already replaced the hyphen ranges
  // turn into a set of JUST comparators.
  debug('comp', comp);
  comp = replaceTildes(comp);
  debug('tildes', comp);
  comp = replaceXRanges(comp);
  debug('xrange', comp);
  comp = replaceStars(comp);
  debug('stars', comp);
  return comp;
};

function isX(id) {
  return !id || id.toLowerCase() === 'x' || id === '*';
}


// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp) {
  return comp.trim().split(/\s+/).map(replaceTilde).join(' ');
}

function replaceTilde(comp) {
  return comp.replace(re.tilde, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr);

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0-0 <' + (+M + 1) + '.0.0-0';
    else if (isX(p))
      // ~1.2 == >=1.2.0- <1.3.0-
      ret = '>=' + M + '.' + m + '.0-0 <' + M + '.' + (+m + 1) + '.0-0'
    else if (pr) {
      debug('replaceTilde pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      ret = '>=' + M + '.' + m + '.' + p + pr +
            ' <' + M + '.' + (+m + 1) + '.0-0';
    } else
      // ~1.2.3 == >=1.2.3-0 <1.3.0-0
      ret = '>=' + M + '.' + m + '.' + p + '-0' +
            ' <' + M + '.' + (+m + 1) + '.0-0'

    debug('tilde return', ret);
    return ret;
  });
}

function replaceXRanges(comp) {
  return comp.split(/\s+/).map(replaceXRange).join(' ');
}

function replaceXRange(comp) {
  comp = comp.trim();
  return comp.replace(re.xRange, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr);
    var xM = isX(M);
    var xm = xM || isX(m);
    var xp = xm || isX(p);
    var anyX = xp;

    if (gtlt === '=' && anyX)
      gtlt = '';

    if (gtlt && anyX) {
      // replace X with 0, and then append the -0 min-prerelease
      if (xM)
        M = 0;
      if (xm)
        m = 0;
      if (xp)
        p = 0;

      ret = gtlt + M + '.' + m + '.' + p + '-0';
    } else if (xM) {
      // allow any
      ret = '*';
    } else if (xm) {
      // append '-0' onto the version, otherwise
      // '1.x.x' matches '2.0.0-beta', since the tag
      // *lowers* the version value
      ret = '>=' + M + '.0.0-0 <' + (+M + 1) + '.0.0-0';
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0-0 <' + M + '.' + (+m + 1) + '.0-0';
    }

    debug('xRange return', ret);

    return ret;
  });
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp) {
  return comp.trim().replace(re.star, '')
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function(version) {
  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version))
      return true;
  }
  return false;
};

function testSet(set, version) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version))
      return false;
  }
  return true;
}

exports.satisfies = satisfies;
function satisfies (version, range) {
  return new Range(range).test(version);
}

exports.maxSatisfying = maxSatisfying;
function maxSatisfying (versions, range) {
  return versions.filter(function(version) {
    return satisfies(version, range);
  }).sort(compare)[0] || null;
}

exports.validRange = validRange;
function validRange(range) {
  try {
    return new Range(range).range;
  } catch (er) {
    return null;
  }
}

})(typeof exports === 'object' ? exports : semver = {});
