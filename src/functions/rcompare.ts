import type SemVer from '../classes/semver.js'
import type { Options } from '../internal/parse-options.js'
import compare from './compare.js'

export default (a: string | SemVer, b: string | SemVer, loose?: Options | boolean) => compare(b, a, loose)
