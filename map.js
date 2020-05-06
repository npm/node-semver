module.exports = testFile => {
  const base = testFile.replace(/test\//, '').replace(/\.m?js$/, '')
  return [`${base}.js`, `${base}.mjs`]
}
