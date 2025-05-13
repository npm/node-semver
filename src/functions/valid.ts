import type SemVer from '../classes/semver.js'
import type { Options } from '../internal/parse-options.js'
import parse from './parse.js'

export default (version: string | SemVer, options?: Options | boolean) => {
  const v = parse(version, options)
  return v ? v.version : null
}
