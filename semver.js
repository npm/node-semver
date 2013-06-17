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
  src.numericIdentifierLoose = '[0-9]+';


  // ## Non-numeric Identifier
  // Zero or more digits, followed by a letter or hyphen, and then zero or
  // more letters, digits, or hyphens.

  src.nonNumericIdentifier = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


  // ## Main Version
  // Three dot-separated numeric identifiers.

  src.mainVersion = '(' + src.numericIdentifier + ')\\.' +
                    '(' + src.numericIdentifier + ')\\.' +
                    '(' + src.numericIdentifier + ')';

  src.mainVersionLoose = '(' + src.numericIdentifierLoose + ')\\.' +
                         '(' + src.numericIdentifierLoose + ')\\.' +
                         '(' + src.numericIdentifierLoose + ')';

  // ## Pre-release Version Identifier
  // A numeric identifier, or a non-numeric identifier.

  src.prereleaseIdentifier = '(?:' + src.numericIdentifier +
                             '|' + src.nonNumericIdentifier + ')';

  src.prereleaseIdentifierLoose = '(?:' + src.numericIdentifierLoose +
                                  '|' + src.nonNumericIdentifier + ')';


  // ## Pre-release Version
  // Hyphen, followed by one or more dot-separated pre-release version
  // identifiers.

  src.prerelease = '(?:-(' + src.prereleaseIdentifier +
                   '(?:\\.' + src.prereleaseIdentifier + ')*))';

  src.prereleaseLoose = '(?:-?(' + src.prereleaseIdentifierLoose +
                        '(?:\\.' + src.prereleaseIdentifierLoose + ')*))';

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

  var full = src.mainVersion +
             src.prerelease + '?' +
             src.build + '?';

  src.full = '^' + full + '$';

  // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
  // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
  // common in the npm registry.
  var loose = '[v=\\s]*' + src.mainVersionLoose +
              '(?:' + src.prereleaseLoose + ')?' +
              '(?:' + src.build + ')?';

  src.loose = '^' + loose + '$';

  src.gtlt = '((?:<|>)?=?)';

  // Something like "2.*" or "1.2.x".
  // Note that "x.x" is a valid xRange identifer, meaning "any version"
  // Only the first item is strictly required.
  src.xRangeIdentifierLoose = src.numericIdentifierLoose + '|x|X|\\*';
  src.xRangeIdentifier = src.numericIdentifier + '|x|X|\\*';

  src.xRangePlain = '[v=\\s]*(' + src.xRangeIdentifier + ')' +
                    '(?:\\.(' + src.xRangeIdentifier + ')' +
                    '(?:\\.(' + src.xRangeIdentifier + ')' +
                    '(?:(' + src.prerelease + ')' +
                    ')?)?)?';

  src.xRangePlainLoose = '[v=\\s]*(' + src.xRangeIdentifierLoose + ')' +
                         '(?:\\.(' + src.xRangeIdentifierLoose + ')' +
                         '(?:\\.(' + src.xRangeIdentifierLoose + ')' +
                         '(?:(' + src.prereleaseLoose + ')' +
                         ')?)?)?';

  // >=2.x, for example, means >=2.0.0-0
  // <1.x would be the same as "<1.0.0-0", though.
  src.xRange = '^' + src.gtlt + '\\s*' + src.xRangePlain + '$';
  src.xRangeLoose = '^' + src.gtlt + '\\s*' + src.xRangePlainLoose + '$';

  // Tilde ranges.
  // Meaning is "reasonably at or greater than"
  src.loneTilde = '(?:~>?)';
  src.tildeTrim = src.loneTilde + '\s+';
  var tildeTrimReplace = '$1';
  src.tilde = '^' + src.loneTilde + src.xRangePlain + '$';
  src.tildeLoose = '^' + src.loneTilde + src.xRangePlainLoose + '$';


  // A simple gt/lt/eq thing, or just "" to indicate "any version"
  src.comparatorLoose = '^' + src.gtlt + '\\s*(' + loose + ')$|^$';
  src.comparator = '^' + src.gtlt + '\\s*(' + full + ')$|^$';


  // An expression to strip any whitespace between the gtlt and the thing
  // it modifies, so that `> 1.2.3` ==> `>1.2.3`
  src.comparatorTrim = src.gtlt +
                       '\\s*(' + loose + '|' + src.xRangePlain + ')';

  // this one has to use the /g flag
  re.comparatorTrim = new RegExp(src.comparatorTrim, 'g');

  var comparatorTrimReplace = '$1$2 ';


  // Something like `1.2.3 - 1.2.4`
  // Note that these all use the loose form, because they'll be
  // checked against either the strict or loose comparator form
  // later.
  src.hyphenRange = '^\\s*(' + src.xRangePlain + ')' +
                    '\\s+-\\s+' +
                    '(' + src.xRangePlain + ')' +
                    '\\s*$';

  src.hyphenRangeLoose = '^\\s*(' + src.xRangePlainLoose + ')' +
                         '\\s+-\\s+' +
                         '(' + src.xRangePlainLoose + ')' +
                         '\\s*$';

  // Star ranges basically just allow anything at all.
  src.star = '(<|>)?=?\\s*\\*';

  // Compile to actual regexp objects.
  // All are flag-free, unless they were created above with a flag.
  for (var i in src) {
    debug(i, src[i]);
    if (!re[i])
      re[i] = new RegExp(src[i]);
  }

  exports.valid = exports.parse = parse;
  function parse(version, loose) {
    var r = loose ? re.loose : re.full;
    return (r.test(version)) ? new SemVer(version, loose) : null;
  }

  exports.clean = clean;
  function clean(version, loose) {
    var s = parse(version, loose);
    return s ? s.version : null;
  }

  exports.SemVer = SemVer;

  function SemVer(version, loose) {
    if (version instanceof SemVer) {
      if (version.loose === loose)
        return version;
      else
        version = version.version;
    }

    if (!(this instanceof SemVer))
      return new SemVer(version, loose);

    debug('SemVer', version, loose);
    this.loose = loose;
    var m = version.match(loose ? re.loose : re.full);

    if (!m)
      throw new TypeError('Invalid Version: ' + version);

    this.raw = version;

    // these are actually numbers
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];

    // numberify any prerelease numeric ids
    if (!m[4])
      this.prerelease = [];
    else
      this.prerelease = m[4].split('.').map(function(id) {
        return (/^[0-9]+$/.test(id)) ? +id : id;
      });

    this.build = m[5] ? m[5].split('.') : [];
    this.format();
  }

  SemVer.prototype.format = function() {
    this.version = this.major + '.' + this.minor + '.' + this.patch;
    if (this.prerelease.length)
      this.version += '-' + this.prerelease.join('.');
    return this.version;
  };

  SemVer.prototype.inspect = function() {
    return '<SemVer "' + this + '">';
  };

  SemVer.prototype.toString = function() {
    return this.value;
  };

  SemVer.prototype.compare = function(other) {
    debug('SemVer.compare', this.version, this.loose, other);
    if (!(other instanceof SemVer))
      other = new SemVer(other, this.loose);

    return this.compareMain(other) || this.comparePre(other);
  };

  SemVer.prototype.compareMain = function(other) {
    if (!(other instanceof SemVer))
      other = new SemVer(other, this.loose);

    return compareIdentifiers(this.major, other.major) ||
           compareIdentifiers(this.minor, other.minor) ||
           compareIdentifiers(this.patch, other.patch);
  };

  SemVer.prototype.comparePre = function(other) {
    if (!(other instanceof SemVer))
      other = new SemVer(other, this.loose);

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
        throw new Error('invalid increment argument: ' + release);
    }
    this.format();
    return this;
  };

  exports.inc = inc;
  function inc(version, release, loose) {
    try {
      return new SemVer(version, loose).inc(release).version;
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

    return (anum && !bnum) ? -1 :
           (bnum && !anum) ? 1 :
           a < b ? -1 :
           a > b ? 1 :
           0;
  }

  exports.rcompareIdentifiers = rcompareIdentifiers;
  function rcompareIdentifiers(a, b) {
    return compareIdentifiers(b, a);
  }

  exports.compare = compare;
  function compare(a, b, loose) {
    return new SemVer(a, loose).compare(b);
  }

  exports.rcompare = rcompare;
  function rcompare(a, b, loose) {
    return compare(b, a, loose);
  }

  exports.sort = sort;
  function sort(list, loose) {
    return list.sort(function(a, b) {
      return exports.compare(a, b, loose);
    });
  }

  exports.rsort = rsort;
  function rsort(list, loose) {
    return list.sort(function(a, b) {
      return exports.rcompare(a, b, loose);
    });
  }

  exports.gt = gt;
  function gt(a, b, loose) {
    return compare(a, b, loose) > 0;
  }

  exports.lt = lt;
  function lt(a, b, loose) {
    return compare(a, b, loose) < 0;
  }

  exports.eq = eq;
  function eq(a, b, loose) {
    return compare(a, b, loose) === 0;
  }

  exports.neq = neq;
  function neq(a, b, loose) {
    return compare(a, b, loose) !== 0;
  }

  exports.gte = gte;
  function gte(a, b, loose) {
    return compare(a, b, loose) >= 0;
  }

  exports.lte = lte;
  function lte(a, b, loose) {
    return compare(a, b, loose) <= 0;
  }

  exports.cmp = cmp;
  function cmp(a, op, b, loose) {
    var ret;
    switch (op) {
      case '===': ret = a === b; break;
      case '!==': ret = a !== b; break;
      case '': case '=': case '==': ret = eq(a, b, loose); break;
      case '!=': ret = neq(a, b, loose); break;
      case '>': ret = gt(a, b, loose); break;
      case '>=': ret = gte(a, b, loose); break;
      case '<': ret = lt(a, b, loose); break;
      case '<=': ret = lte(a, b, loose); break;
      default: throw new TypeError('Invalid operator: ' + op);
    }
    return ret;
  }

  exports.Comparator = Comparator;
  function Comparator(comp, loose) {
    if (comp instanceof Comparator) {
      if (comp.loose === loose)
        return comp;
      else
        comp = comp.value;
    }

    if (!(this instanceof Comparator))
      return new Comparator(comp, loose);

    debug('comparator', comp, loose);
    this.loose = loose;
    this.parse(comp);

    if (this.semver === ANY)
      this.value = '';
    else
      this.value = this.operator + this.semver.version;
  }

  var ANY = {};
  Comparator.prototype.parse = function(comp) {
    var r = this.loose ? re.comparatorLoose : re.comparator;
    var m = comp.match(r);

    if (!m)
      throw new TypeError('Invalid comparator: ' + comp);

    // debug('parsed comparator', m);
    this.operator = m[1];
    // if it literally is just '>' or '' then allow anything.
    if (!m[2])
      this.semver = ANY;
    else {
      this.semver = new SemVer(m[2], this.loose);

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
    debug('Comparator.test', version, this.loose);
    return (this.semver === ANY) ? true :
           cmp(version, this.operator, this.semver, this.loose);
  };


  exports.Range = Range;
  function Range(range, loose) {
    if ((range instanceof Range) && range.loose === loose)
      return range;

    if (!(this instanceof Range))
      return new Range(range, loose);

    this.loose = loose;

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
    var loose = this.loose;
    range = range.trim();
    debug('range', range, loose);
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    var hr = loose ? re.hyphenRangeLoose : re.hyphenRange;
    range = range.replace(hr, hyphenReplace);
    debug('hyphen replace', range);
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re.comparatorTrim, comparatorTrimReplace);
    debug('comparator trim', range);

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re.tildeTrim, tildeTrimReplace);

    // normalize spaces
    range = range.split(/\s+/).join(' ');

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    var compRe = loose ? re.comparatorLoose : re.comparator;
    var set = range.split(' ').map(function(comp) {
      return parseComparator(comp, loose);
    }).join(' ').split(/\s+/);
    if (this.loose) {
      // in loose mode, throw out any that are not valid comparators
      set = set.filter(function(comp) {
        return !!comp.match(compRe);
      });
    }
    set = set.map(function(comp) {
      return new Comparator(comp, loose);
    });

    return set;
  };

  // Mostly just for testing and legacy API reasons
  exports.toComparators = toComparators;
  function toComparators(range, loose) {
    return new Range(range, loose).set.map(function(comp) {
      return comp.map(function(c) {
        return c.value;
      }).join(' ').trim().split(' ');
    });
  }

  // comprised of xranges, tildes, stars, and gtlt's at this point.
  // already replaced the hyphen ranges
  // turn into a set of JUST comparators.
  function parseComparator(comp, loose) {
    debug('comp', comp);
    comp = replaceTildes(comp, loose);
    debug('tildes', comp);
    comp = replaceXRanges(comp, loose);
    debug('xrange', comp);
    comp = replaceStars(comp, loose);
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
  function replaceTildes(comp, loose) {
    return comp.trim().split(/\s+/).map(function(comp) {
      return replaceTilde(comp, loose);
    }).join(' ');
  }

  function replaceTilde(comp, loose) {
    var r = loose ? re.tildeLoose : re.tilde;
    return comp.replace(r, function(_, M, m, p, pr) {
      debug('tilde', comp, _, M, m, p, pr);

      if (isX(M))
        ret = '';
      else if (isX(m))
        ret = '>=' + M + '.0.0-0 <' + (+M + 1) + '.0.0-0';
      else if (isX(p))
        // ~1.2 == >=1.2.0- <1.3.0-
        ret = '>=' + M + '.' + m + '.0-0 <' + M + '.' + (+m + 1) + '.0-0';
      else if (pr) {
        debug('replaceTilde pr', pr);
        if (pr.charAt(0) !== '-')
          pr = '-' + pr;
        ret = '>=' + M + '.' + m + '.' + p + pr +
              ' <' + M + '.' + (+m + 1) + '.0-0';
      } else
        // ~1.2.3 == >=1.2.3-0 <1.3.0-0
        ret = '>=' + M + '.' + m + '.' + p + '-0' +
              ' <' + M + '.' + (+m + 1) + '.0-0';

      debug('tilde return', ret);
      return ret;
    });
  }

  function replaceXRanges(comp, loose) {
    debug('replaceXRanges', comp, loose);
    return comp.split(/\s+/).map(function(comp) {
      return replaceXRange(comp, loose);
    }).join(' ');
  }

  function replaceXRange(comp, loose) {
    comp = comp.trim();
    var r = loose ? re.xRangeLoose : re.xRange;
    return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
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

        if (gtlt === '>') {
          // >1 => >=2.0.0-0
          // >1.2 => >=1.3.0-0
          // >1.2.3 => >= 1.2.4-0
          gtlt = '>=';
          if (xM) {
            // no change
          } else if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else if (xp) {
            m = +m + 1;
            p = 0;
          }
        }


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
  function replaceStars(comp, loose) {
    debug('replaceStars', comp, loose);
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re.star, '');
  }

  // This function is passed to string.replace(re.hyphenRange)
  // M, m, patch, prerelease, build
  // 1.2 - 3.4.5 => >=1.2.0-0 <=3.4.5
  // 1.2.3 - 3.4 => >=1.2.0-0 <3.5.0-0 Any 3.4.x will do
  // 1.2 - 3.4 => >=1.2.0-0 <3.5.0-0
  function hyphenReplace($0,
                         from, fM, fm, fp, fpr, fb,
                         to, tM, tm, tp, tpr, tb) {

    if (isX(fM))
      from = '';
    else if (isX(fm))
      from = '>=' + fM + '.0.0-0';
    else if (isX(fp))
      from = '>=' + fM + '.' + fm + '.0-0';
    else
      from = '>=' + from;

    if (isX(tM))
      to = '';
    else if (isX(tm))
      to = '<' + (+tM + 1) + '.0.0-0';
    else if (isX(tp))
      to = '<' + tM + '.' + (+tm + 1) + '.0-0';
    else if (tpr)
      to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
    else
      to = '<=' + to;

    return (from + ' ' + to).trim();
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
  function satisfies(version, range, loose) {
    return new Range(range, loose).test(version);
  }

  exports.maxSatisfying = maxSatisfying;
  function maxSatisfying(versions, range, loose) {
    return versions.filter(function(version) {
      return satisfies(version, range, loose);
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
