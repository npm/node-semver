import eq from './eq.js'
import neq from './neq.js'
import gt from './gt.js'
import gte from './gte.js'
import lt from './lt.js'
import lte from './lte.js'
import type SemVer from '../classes/semver.js'
import type { Options } from '../internal/parse-options.js'

export default (a: string | SemVer, op: string, b: string | SemVer, loose?: boolean | Options): boolean => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
