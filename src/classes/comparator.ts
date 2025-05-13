import parseOptions, { type Options } from '../internal/parse-options.js'
import { safeRe as re, t } from '../internal/re.js'
import cmp from '../functions/cmp.js'
import debug from '../internal/debug.js'
import SemVer from './semver.js'
import Range from './range.js'

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
export default class Comparator {
  loose = false
  value = ''
  semver: typeof ANY | SemVer = ANY

  operator = ''

  static get ANY() {
    return ANY
  }

  /**
   * Checks if the value is a SemVer instance or the ANY symbol.
   * @param value The value to check
   */
  static isSemver(value: typeof ANY | SemVer): value is SemVer {
    return value !== ANY
  }

  options: Options = {}

  constructor(comp: string | Comparator, options?: Options | boolean) {
    const opts = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!opts.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    comp = comp.trim().split(/\s+/).join(' ')
    debug('comparator', comp, opts)
    this.options = opts
    this.loose = !!opts.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse(comp: string): void {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString(): string {
    return this.value
  }

  test(version: string | symbol | SemVer): boolean {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch {
        return false
      }
    }

    return cmp(version as SemVer, this.operator, this.semver, this.options)
  }

  /**
   * Checks if this comparator intersects with another comparator.
   * Two comparators intersect if there is a version that satisfies both.
   *
   * @param comp The comparator to check for intersection.
   * @param options Options or loose value as boolean.
   * @returns True if the comparators intersect, false otherwise.
   * @throws {TypeError} If `comp` is not a Comparator instance.
   */
  intersects(comp: Comparator, options?: Options | boolean): boolean {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver as SemVer)
    }

    options = parseOptions(options)

    // Special cases where nothing can possibly be lower
    if (options.includePrerelease && (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
      return false
    }
    if (!options.includePrerelease && (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
      return false
    }

    // Same direction increasing (> or >=)
    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
      return true
    }
    // Same direction decreasing (< or <=)
    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
      return true
    }
    // same SemVer and both sides are inclusive (<= or >=)
    if (
      (this.semver as SemVer).version === (comp.semver as SemVer).version &&
      this.operator.includes('=') &&
      comp.operator.includes('=')
    ) {
      return true
    }
    // opposite directions less than
    if (
      cmp(this.semver as SemVer, '<', comp.semver as SemVer, options) &&
      this.operator.startsWith('>') &&
      comp.operator.startsWith('<')
    ) {
      return true
    }
    // opposite directions greater than
    if (
      cmp(this.semver as SemVer, '>', comp.semver as SemVer, options) &&
      this.operator.startsWith('<') &&
      comp.operator.startsWith('>')
    ) {
      return true
    }
    return false
  }
}
