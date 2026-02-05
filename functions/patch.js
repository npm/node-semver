import SemVer from '../classes/semver.js'
const patch = (a, loose) => new SemVer(a, loose).patch
export default patch
