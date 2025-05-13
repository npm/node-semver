import SemVer from '../classes/semver.js'
import type { Options } from '../internal/parse-options.js'

const compare = (a: string | SemVer, b: string | SemVer, loose?: boolean | Options): number =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

export default compare
