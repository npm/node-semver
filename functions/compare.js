import SemVer from '../classes/semver.js'
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

export default compare