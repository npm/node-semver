import type SemVer from '../classes/semver.js'
import type { Options } from '../internal/parse-options.js'
import Range from '../classes/range.js'

export default (version: string | SemVer, range: Range | string, options?: Options | boolean) => {
  try {
    range = new Range(range, options)
  } catch {
    return false
  }
  return range.test(version)
}
