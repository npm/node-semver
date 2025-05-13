import SemVer from '../classes/semver.js'
import type { Options } from '../internal/parse-options.js'

export default (
  version: string | SemVer,
  release: string,
  options: Options,
  identifier: string,
  identifierBase?: boolean
) => {
  // if (typeof options === 'string') {
  //   identifierBase = identifier
  //   identifier = options
  //   options = undefined
  // }

  try {
    return new SemVer(version instanceof SemVer ? version.version : version, options).inc(
      release,
      identifier,
      identifierBase
    ).version
  } catch {
    return null
  }
}
