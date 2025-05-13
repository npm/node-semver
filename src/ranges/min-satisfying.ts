import SemVer from '../classes/semver.js'
import Range from '../classes/range.js'
import type { Options } from '../internal/parse-options.js'

export default <T = SemVer | string>(versions: T[], range: Range | string, options?: Options | boolean): T | null => {
  let min: T | undefined
  let minSV: SemVer | undefined
  let rangeObj: Range
  try {
    rangeObj = new Range(range, options)
  } catch {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v as string)) {
      // satisfies(v, range, options)
      if (!min || (minSV && minSV.compare(v as string) === 1)) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min as string, options)
      }
    }
  })
  return min ?? null
}
