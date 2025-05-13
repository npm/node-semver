import type SemVer from '../classes/semver.js'
import type { Options } from '../internal/parse-options.js'
import compare from './compare.js'

export default (a: string | SemVer, b: string | SemVer, loose?: boolean | Options): boolean => compare(a, b, loose) > 0
