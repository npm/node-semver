import outside from './outside.js'
import type { Options } from '../internal/parse-options.js'
import type SemVer from '../classes/semver.js'
import type Range from '../classes/range.js'

// Determine if version is greater than all the versions possible in the range.
export default (version: string | SemVer, range: Range | string, options?: Options | boolean) =>
  outside(version, range, '>', options)
