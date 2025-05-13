import type SemVer from '../classes/semver.js'
import type { Options } from '../internal/parse-options.js'
import compareBuild from './compare-build.js'

export default (list: (string | SemVer)[], loose?: Options | boolean) => list.sort((a, b) => compareBuild(b, a, loose))
