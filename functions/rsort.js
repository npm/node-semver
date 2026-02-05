import compareBuild from './compare-build.js'
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
export default rsort