#!/usr/bin/env node

/**
 * Update test imports to use package exports instead of relative paths
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const testDir = path.join(rootDir, 'test')

/**
 * Get all .js test files (except export-structure.js which is already ESM)
 */
function getTestFiles(dir) {
  const files = []

  if (!fs.existsSync(dir)) {
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isFile() && entry.name.endsWith('.js') && entry.name !== 'export-structure.js') {
      files.push(fullPath)
    } else if (entry.isDirectory()) {
      files.push(...getTestFiles(fullPath))
    }
  }

  return files
}

/**
 * Update require statements in a file
 */
function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  // Pattern: require('../../') or require('../..')
  // Replace with: require('semver')
  const pattern1 = /require\(['"]\.\.\/\.\.\/['"]\)/g
  if (pattern1.test(content)) {
    content = content.replace(pattern1, "require('semver')")
    modified = true
  }

  // Pattern: require('../../classes/X')
  // Replace with: require('semver/classes/X')
  const pattern2 = /require\(['"]\.\.\/\.\.\/classes\/([^'"]+)['"]\)/g
  if (pattern2.test(content)) {
    content = content.replace(pattern2, "require('semver/classes/$1')")
    modified = true
  }

  // Pattern: require('../../functions/X')
  // Replace with: require('semver/functions/X')
  const pattern3 = /require\(['"]\.\.\/\.\.\/functions\/([^'"]+)['"]\)/g
  if (pattern3.test(content)) {
    content = content.replace(pattern3, "require('semver/functions/$1')")
    modified = true
  }

  // Pattern: require('../../ranges/X')
  // Replace with: require('semver/ranges/X')
  const pattern4 = /require\(['"]\.\.\/\.\.\/ranges\/([^'"]+)['"]\)/g
  if (pattern4.test(content)) {
    content = content.replace(pattern4, "require('semver/ranges/$1')")
    modified = true
  }

  // Pattern: require('../../internal/X')
  // Replace with: require('semver/internal/X')
  const pattern5 = /require\(['"]\.\.\/\.\.\/internal\/([^'"]+)['"]\)/g
  if (pattern5.test(content)) {
    content = content.replace(pattern5, "require('semver/internal/$1')")
    modified = true
  }

  // Pattern: require('../../../') (for deeper nested tests)
  // Replace with: require('semver')
  const pattern6 = /require\(['"]\.\.\/\.\.\/\.\.\/['"]\)/g
  if (pattern6.test(content)) {
    content = content.replace(pattern6, "require('semver')")
    modified = true
  }

  // Pattern: require('../../../classes/X') etc.
  const pattern7 = /require\(['"]\.\.\/\.\.\/\.\.\/classes\/([^'"]+)['"]\)/g
  if (pattern7.test(content)) {
    content = content.replace(pattern7, "require('semver/classes/$1')")
    modified = true
  }

  const pattern8 = /require\(['"]\.\.\/\.\.\/\.\.\/functions\/([^'"]+)['"]\)/g
  if (pattern8.test(content)) {
    content = content.replace(pattern8, "require('semver/functions/$1')")
    modified = true
  }

  const pattern9 = /require\(['"]\.\.\/\.\.\/\.\.\/ranges\/([^'"]+)['"]\)/g
  if (pattern9.test(content)) {
    content = content.replace(pattern9, "require('semver/ranges/$1')")
    modified = true
  }

  const pattern10 = /require\(['"]\.\.\/\.\.\/\.\.\/internal\/([^'"]+)['"]\)/g
  if (pattern10.test(content)) {
    content = content.replace(pattern10, "require('semver/internal/$1')")
    modified = true
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    return true
  }

  return false
}

/**
 * Main function
 */
function main() {
  console.log('🔧 Updating test imports to use package exports...\n')

  const files = getTestFiles(testDir)
  console.log(`📋 Found ${files.length} test files\n`)

  let updatedCount = 0

  for (const file of files) {
    const relativePath = path.relative(rootDir, file)
    if (updateFile(file)) {
      console.log(`✅ Updated: ${relativePath}`)
      updatedCount++
    }
  }

  console.log(`\n✅ Updated ${updatedCount} files`)
  console.log('📦 Tests now use package exports (e.g., require("semver/classes/semver"))')
}

main()
