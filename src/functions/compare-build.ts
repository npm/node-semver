import SemVer from '../classes/semver.js'
import type { Options } from '../internal/parse-options.js'

export default (a: string | SemVer, b: string | SemVer, loose?: boolean | Options): number => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
