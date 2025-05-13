import SemVer from '../classes/semver.js'
import type { Options } from '../internal/parse-options.js'
import parse from './parse.js'

export default (version: string | SemVer, options?: Options | boolean) => {
  const parsed = parse(version, options)
  return parsed && parsed.prerelease.length ? parsed.prerelease : null
}
