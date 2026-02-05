import compareBuild from './compare-build.js'
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
export default sort