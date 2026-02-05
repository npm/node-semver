#!/usr/bin/env node

/**
 * Build script for dual-format distribution (ESM + CJS)
 *
 * This script:
 * 1. Cleans the dist/ directory
 * 2. Copies ESM source files to dist/esm/
 * 3. Transpiles ESM to CJS in dist/cjs/ using Babel
 *
 * Why dual-format build?
 * - Source is ESM for modern module support
 * - Build outputs both ESM and CJS for broad ecosystem compatibility
 * - Uses package.json "exports" for conditional module resolution
 *
 * Note: template-oss-check is disabled because dual-format build structure
 * (shipping dist/) differs from @npmcli template expectations (shipping raw
 * source). This is intentional - dual-format distribution is standard for
 * modern packages requiring both ESM and CJS support.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { transformFile } from '@babel/core'
import { promisify } from 'util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const transformFileAsync = promisify(transformFile)

// Directories and files to process
const SOURCE_DIRS = ['classes', 'functions', 'internal', 'ranges', 'bin']
const SOURCE_FILES = ['index.js', 'preload.js']

// Babel configuration for ESM → CJS
const babelConfig = {
  presets: [
    ['@babel/preset-env', {
      targets: { node: '10' },
      modules: 'commonjs',
    }],
  ],
}

/**
 * Recursively remove a directory
 */
function rmdir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true })
  }
}

/**
 * Recursively create directory
 */
function mkdirp(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Copy a file
 */
function copyFile(src, dest) {
  mkdirp(path.dirname(dest))
  fs.copyFileSync(src, dest)
}

/**
 * Get all .js files in a directory recursively
 */
function getJsFiles(dir, baseDir = dir) {
  const files = []

  if (!fs.existsSync(dir)) {
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(baseDir, fullPath)

    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(relativePath)
    } else if (entry.isDirectory()) {
      files.push(...getJsFiles(fullPath, baseDir))
    }
  }

  return files
}

/**
 * Get all source files to process
 */
function getAllSourceFiles() {
  const files = []

  // Add root files
  for (const file of SOURCE_FILES) {
    if (fs.existsSync(path.join(rootDir, file))) {
      files.push(file)
    }
  }

  // Add files from directories
  for (const dir of SOURCE_DIRS) {
    const dirPath = path.join(rootDir, dir)
    if (fs.existsSync(dirPath)) {
      const dirFiles = getJsFiles(dirPath, rootDir)
      files.push(...dirFiles)
    }
  }

  return files
}

/**
 * Copy ESM files to dist/esm
 */
function copyEsmFiles(files) {
  console.log('📦 Copying ESM files to dist/esm...')

  for (const file of files) {
    const src = path.join(rootDir, file)
    const dest = path.join(rootDir, 'dist', 'esm', file)
    copyFile(src, dest)
  }

  console.log(`✅ Copied ${files.length} ESM files`)
}

/**
 * Transpile ESM to CJS in dist/cjs
 */
async function transpileToCjs(files) {
  console.log('🔄 Transpiling to CJS in dist/cjs...')

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    const src = path.join(rootDir, file)
    const dest = path.join(rootDir, 'dist', 'cjs', file)

    try {
      const result = await transformFileAsync(src, babelConfig)

      if (!result || !result.code) {
        throw new Error('Babel transformation returned no code')
      }

      let code = result.code

      // Add interop for default export to maintain CommonJS compatibility
      // This ensures `require('semver')` returns the default export directly
      // instead of requiring `require('semver').default`
      if (code.includes('exports.default')) {
        code += '\n\n// CommonJS interop - export default as module.exports\n'
        code += 'if (exports.default) {\n'
        code += '  // Handle both object and function/class exports\n'
        code += '  if (typeof exports.default === "object") {\n'
        code += '    Object.assign(exports, exports.default);\n'
        code += '  }\n'
        code += '  module.exports = exports.default;\n'
        code += '  module.exports.default = exports.default;\n'
        code += '}\n'
      }

      mkdirp(path.dirname(dest))
      fs.writeFileSync(dest, code, 'utf8')
      successCount++
    } catch (err) {
      console.error(`❌ Error transpiling ${file}:`, err.message)
      errorCount++
    }
  }

  console.log(`✅ Transpiled ${successCount} files to CJS`)

  if (errorCount > 0) {
    console.error(`❌ ${errorCount} files failed to transpile`)
    process.exit(1)
  }
}

/**
 * Copy non-JS files (like range.bnf)
 */
function copyNonJsFiles() {
  const nonJsFiles = ['range.bnf']

  for (const file of nonJsFiles) {
    const src = path.join(rootDir, file)
    if (fs.existsSync(src)) {
      copyFile(src, path.join(rootDir, 'dist', 'esm', file))
      copyFile(src, path.join(rootDir, 'dist', 'cjs', file))
    }
  }
}

/**
 * Create package.json files for each format
 */
function createPackageJsonFiles() {
  // dist/cjs/package.json - marks directory as CommonJS
  const cjsPackageJson = {
    type: 'commonjs',
  }

  fs.writeFileSync(
    path.join(rootDir, 'dist', 'cjs', 'package.json'),
    JSON.stringify(cjsPackageJson, null, 2) + '\n',
    'utf8'
  )

  // dist/esm/package.json - marks directory as ESM (optional but explicit)
  const esmPackageJson = {
    type: 'module',
  }

  fs.writeFileSync(
    path.join(rootDir, 'dist', 'esm', 'package.json'),
    JSON.stringify(esmPackageJson, null, 2) + '\n',
    'utf8'
  )
}

/**
 * Main build function
 */
async function build() {
  console.log('🏗️  Building semver dual-format distribution...\n')

  // Clean dist/
  console.log('🧹 Cleaning dist/ directory...')
  rmdir(path.join(rootDir, 'dist'))
  console.log('✅ Cleaned dist/\n')

  // Get all source files
  const files = getAllSourceFiles()
  console.log(`📋 Found ${files.length} source files\n`)

  // Copy ESM files
  copyEsmFiles(files)
  console.log()

  // Transpile to CJS
  await transpileToCjs(files)
  console.log()

  // Copy non-JS files
  copyNonJsFiles()

  // Create package.json files for each format
  createPackageJsonFiles()

  console.log('✅ Build complete!\n')
  console.log('📦 Output:')
  console.log('   - dist/esm/ (ES Modules)')
  console.log('   - dist/cjs/ (CommonJS)')
}

// Run build
build().catch(err => {
  console.error('❌ Build failed:', err)
  process.exit(1)
})
