import SemVer from '../classes/semver.js'
import Range from '../classes/range.js'
import type { Options } from '../internal/parse-options.js'

export default <T = SemVer | string>(versions: T[], range: Range | string, options?: Options | boolean): T | null => {
  let max: T | undefined
  let maxSV: SemVer | undefined
  let rangeObj: Range
  try {
    rangeObj = new Range(range, options)
  } catch {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v as string)) {
      // satisfies(v, range, options)
      if (!max || (maxSV && maxSV.compare(v as string) === -1)) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max as string, options)
      }
    }
  })
  return max ?? null
}
