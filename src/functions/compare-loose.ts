import compare from './compare.js'
import type SemVer from '../classes/semver.js'

export default (a: string | SemVer, b: string | SemVer) => compare(a, b, true)
