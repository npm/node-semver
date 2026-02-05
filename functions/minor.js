import SemVer from '../classes/semver.js'
const minor = (a, loose) => new SemVer(a, loose).minor
export default minor