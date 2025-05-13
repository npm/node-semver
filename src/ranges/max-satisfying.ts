import SemVer from '../classes/semver.js'
import Range from '../classes/range.js'
import type { Options } from '../internal/parse-options.js'

export default (versions: SemVer[], range: Range, options?: Options | boolean): SemVer | null => {
  let max: SemVer | undefined
  let maxSV: SemVer | undefined
  let rangeObj: Range
  try {
    rangeObj = new Range(range, options)
  } catch {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || (maxSV && maxSV.compare(v) === -1)) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max ?? null
}
