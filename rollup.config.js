const fs = require('fs')
const commonjs = require('@rollup/plugin-commonjs')

const pkgJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

module.exports = {
  input: pkgJson.main,
  plugins: [
    commonjs({
      strictRequires: true,
      ignoreTryCatch: true,
    }),
  ],
  external: Object.keys(pkgJson.dependencies),
  onwarn: (e) => {
    if (e.code === 'CIRCULAR_DEPENDENCY') {
      return
    }

    throw new Error(e)
  },
}
