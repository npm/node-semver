import SemVer from '../classes/semver.js'
import Range from '../classes/range.js'
import type { Options } from '../internal/parse-options.js'

export default (versions: SemVer[], range: Range, options?: Options | boolean): SemVer | null => {
  let min: SemVer | undefined
  let minSV: SemVer | undefined
  let rangeObj: Range
  try {
    rangeObj = new Range(range, options)
  } catch {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || (minSV && minSV.compare(v) === 1)) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min ?? null
}
