'use strict'

// Map test files to their corresponding system files in dist/
// Tests import from dist/cjs/ (CommonJS), so map to that
// Test files come in without 'test/' prefix, so just prepend dist/cjs/
module.exports = testFile => `dist/cjs/${testFile}`
