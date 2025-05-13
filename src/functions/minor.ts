import SemVer from '../classes/semver.js'
import type { Options } from '../internal/parse-options.js'

export default (a: string | SemVer, loose?: Options | boolean) => new SemVer(a, loose).minor
