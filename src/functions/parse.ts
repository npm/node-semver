import type { Options } from '../internal/parse-options.js'
import SemVer from '../classes/semver.js'

export default function (version: SemVer | string, options?: Options | boolean, throwErrors = false): SemVer | null {
  if (version instanceof SemVer) {
    return version
  }
  try {
    return new SemVer(version, options)
  } catch (er) {
    if (!throwErrors) {
      return null
    }
    throw er
  }
}
