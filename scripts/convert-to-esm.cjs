#!/usr/bin/env node
'use strict'

/**
 * Convert semver codebase from CommonJS to ESM
 *
 * This script performs automated conversion with awareness of:
 * - Default vs named exports
 * - Re-export patterns
 * - Complex export patterns (exports.x = value)
 * - .js extension requirements
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')

// Directories to convert
const DIRS_TO_CONVERT = [
  'internal',
  'classes',
  'functions',
  'ranges',
  'bin',
]

// Root-level files to convert
const ROOT_FILES = [
  'index.js',
  'preload.js',
]

const stats = {
  filesProcessed: 0,
  requiresConverted: 0,
  exportsConverted: 0,
  extensionsAdded: 0,
  strictRemoved: 0,
  warnings: [],
}

/**
 * Add .js extension to relative imports
 */
function addJsExtension (modulePath) {
  // Don't modify node built-ins or npm packages
  if (!modulePath.startsWith('.')) {
    return modulePath
  }

  // Already has extension
  if (modulePath.endsWith('.js') || modulePath.endsWith('.json')) {
    return modulePath
  }

  stats.extensionsAdded++
  return `${modulePath}.js`
}

/**
 * Find all .js files in a directory
 */
function findJsFiles (dir) {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...findJsFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Detect if a file is a simple re-export
 */
function detectReExport (content) {
  // Pattern: module.exports = require('./path')
  const match = content.match(/module\.exports\s*=\s*require\(['"]([^'"]+)['"]\)/)
  if (match) {
    return match[1] // Return the required path
  }
  return null
}

/**
 * Convert a single file from CJS to ESM
 */
function convertFile (filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  const originalContent = content
  const relativePath = path.relative(ROOT, filePath)

  console.log(`Converting: ${relativePath}`)

  // Track conversions for this file
  const fileStats = {
    requires: 0,
    exports: 0,
    extensions: 0,
  }

  // Remove 'use strict' (implicit in ESM)
  if (content.includes("'use strict'") || content.includes('"use strict"')) {
    content = content.replace(/^['"]use strict['"]\s*\n*/gm, '')
    stats.strictRemoved++
  }

  // Check for simple re-export pattern first
  const reExportPath = detectReExport(originalContent)
  if (reExportPath) {
    const newPath = addJsExtension(reExportPath)
    content = `// XXX remove in v8 or beyond\nexport { default } from '${newPath}'\n`
    stats.exportsConverted++
    console.log(`  → Re-export detected: ${reExportPath}`)
  } else {
    // Convert require statements to imports
    // Pattern 1: const foo = require('bar')
    content = content.replace(
      /const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g,
      (match, varName, modulePath) => {
        fileStats.requires++
        const newPath = addJsExtension(modulePath)
        return `import ${varName} from '${newPath}'`
      }
    )

    // Pattern 2: const { foo, bar } = require('baz')
    // Also handles destructuring with rename: { foo: bar } → { foo as bar }
    content = content.replace(
      /const\s+\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\)/g,
      (match, imports, modulePath) => {
        fileStats.requires++
        const newPath = addJsExtension(modulePath)
        // Convert destructuring rename syntax from : to as
        const esmImports = imports.replace(/(\w+)\s*:\s*(\w+)/g, '$1 as $2')
        return `import {${esmImports}} from '${newPath}'`
      }
    )

    // Convert exports
    // Handle: exports = module.exports = {}
    content = content.replace(
      /exports\s*=\s*module\.exports\s*=\s*\{\}/g,
      () => {
        // This is just initialization, we'll handle the actual exports later
        return '// Exports defined below'
      }
    )

    // Handle: const x = exports.x = value
    // Convert to: const x = value\n + track for export
    const exportAssignments = []
    content = content.replace(
      /const\s+(\w+)\s*=\s*exports\.(\w+)\s*=\s*(.+)/g,
      (match, varName, exportName, value) => {
        if (varName === exportName) {
          exportAssignments.push(varName)
          fileStats.exports++
          return `const ${varName} = ${value}`
        }
        return match // Don't modify if names don't match
      }
    )

    // Handle: exports.foo = 'string literal' or similar
    content = content.replace(
      /exports\.(\w+)\s*=\s*(['"`][^'"`]*['"`])/g,
      (match, name, value) => {
        exportAssignments.push(name)
        fileStats.exports++
        return `export const ${name} = ${value}`
      }
    )

    // Handle: module.exports = { shorthand properties }
    // This should become: export default { ... }
    content = content.replace(
      /module\.exports\s*=\s*\{([^}]+)\}/g,
      (match, props) => {
        fileStats.exports++
        // Always use default export for object literals
        return `export default {${props}}`
      }
    )

    // Handle: module.exports = ClassName (single export)
    content = content.replace(
      /module\.exports\s*=\s*(\w+)\s*$/gm,
      (match, exportValue) => {
        fileStats.exports++
        return `export default ${exportValue}`
      }
    )

    // If we collected export assignments (from const x = exports.x pattern),
    // add them at the end
    if (exportAssignments.length > 0) {
      content += `\nexport default {\n  ${exportAssignments.join(',\n  ')},\n}\n`
    }
  }

  // Update stats
  stats.requiresConverted += fileStats.requires
  stats.exportsConverted += fileStats.exports
  stats.extensionsAdded += fileStats.extensions

  // Only write if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content)
    stats.filesProcessed++
    console.log(`  ✓ Converted (${fileStats.requires} requires, ${fileStats.exports} exports)`)
  } else {
    console.log(`  - No changes needed`)
  }
}

/**
 * Main conversion process
 */
function main () {
  console.log('Starting ESM conversion...\n')

  const allFiles = []

  // Collect all files to convert
  for (const dir of DIRS_TO_CONVERT) {
    const fullDir = path.join(ROOT, dir)
    if (fs.existsSync(fullDir)) {
      allFiles.push(...findJsFiles(fullDir))
    }
  }

  for (const file of ROOT_FILES) {
    const fullPath = path.join(ROOT, file)
    if (fs.existsSync(fullPath)) {
      allFiles.push(fullPath)
    }
  }

  console.log(`Found ${allFiles.length} files to convert\n`)

  // Convert each file
  for (const file of allFiles) {
    try {
      convertFile(file)
    } catch (err) {
      console.error(`Error converting ${file}: ${err.message}`)
      stats.warnings.push(`${file}: ${err.message}`)
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('Conversion Summary')
  console.log('='.repeat(60))
  console.log(`Files processed:     ${stats.filesProcessed}`)
  console.log(`Requires converted:  ${stats.requiresConverted}`)
  console.log(`Exports converted:   ${stats.exportsConverted}`)
  console.log(`Extensions added:    ${stats.extensionsAdded}`)
  console.log(`'use strict' removed: ${stats.strictRemoved}`)

  if (stats.warnings.length > 0) {
    console.log('\nWarnings:')
    stats.warnings.forEach(w => console.log(`  ⚠ ${w}`))
  }

  console.log('\n' + '='.repeat(60))
  console.log('Next steps:')
  console.log('1. Add "type": "module" to package.json')
  console.log('2. Review git diff for any issues')
  console.log('3. Run: node test/export-structure.js')
  console.log('4. If test passes, commit changes')
  console.log('='.repeat(60))
}

main()
