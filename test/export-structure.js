/**
 * Export Structure Test
 *
 * This test captures the actual export structure of all modules.
 * Run this before ESM migration to create a baseline, then after
 * migration to verify exports are preserved.
 */

import fs from 'fs'
import path from 'path'
import { test } from 'tap'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Directories containing modules to test
const MODULE_DIRS = ['internal', 'classes', 'functions', 'ranges']
const ROOT_FILES = ['index.js', 'preload.js']

/**
 * Get the type and structure of an export
 */
function inspectExport (exported) {
  const type = typeof exported

  if (type === 'function') {
    return {
      type: 'function',
      name: exported.name || 'anonymous',
      isClass: /^class\s/.test(exported.toString()),
    }
  }

  if (type === 'object' && exported !== null) {
    if (Array.isArray(exported)) {
      return {
        type: 'array',
        length: exported.length,
      }
    }

    if (exported instanceof RegExp) {
      return {
        type: 'regexp',
        pattern: exported.toString(),
      }
    }

    // Plain object - capture its keys
    return {
      type: 'object',
      keys: Object.keys(exported).sort(),
    }
  }

  // Primitives
  return {
    type,
    value: type === 'string' || type === 'number' || type === 'boolean' ? exported : undefined,
  }
}

/**
 * Discover all .js files in a directory
 */
function findJsFiles (dir) {
  const files = []
  const fullDir = path.join(__dirname, '..', dir)

  if (!fs.existsSync(fullDir)) {
    return files
  }

  const entries = fs.readdirSync(fullDir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(path.join(dir, entry.name))
    }
  }

  return files
}

/**
 * Get all module paths to test
 */
function getAllModules () {
  const modules = [...ROOT_FILES]

  for (const dir of MODULE_DIRS) {
    modules.push(...findJsFiles(dir))
  }

  return modules.sort()
}

/**
 * Inspect a module's exports
 */
async function inspectModule (modulePath) {
  const fullPath = path.join(__dirname, '..', modulePath)
  const module = await import(fullPath)

  // Handle default export
  const exported = module.default !== undefined ? module.default : module
  const exportType = typeof exported

  const result = {
    path: modulePath,
    exportType,
  }

  if (exportType === 'function') {
    result.details = inspectExport(exported)
  } else if (exportType === 'object' && exported !== null) {
    // For objects, capture each property
    result.properties = {}
    for (const key of Object.keys(exported).sort()) {
      result.properties[key] = inspectExport(exported[key])
    }
  } else {
    result.details = inspectExport(exported)
  }

  return result
}

test('capture export structure', async (t) => {
  const modules = getAllModules()
  const exportStructure = {}

  for (const modulePath of modules) {
    try {
      exportStructure[modulePath] = await inspectModule(modulePath)
    } catch (err) {
      t.fail(`Failed to inspect ${modulePath}: ${err.message}`)
    }
  }

  // Save the structure to a snapshot file
  const snapshotPath = path.join(__dirname, 'export-structure.json')
  fs.writeFileSync(snapshotPath, JSON.stringify(exportStructure, null, 2))

  t.pass(`Captured export structure for ${modules.length} modules`)
  t.comment(`Snapshot saved to: ${snapshotPath}`)

  // Display summary
  t.comment('\nExport Summary:')
  for (const [modulePath, info] of Object.entries(exportStructure)) {
    if (info.exportType === 'function') {
      t.comment(`  ${modulePath}: ${info.details.isClass ? 'class' : 'function'}`)
    } else if (info.exportType === 'object') {
      const propCount = Object.keys(info.properties || {}).length
      t.comment(`  ${modulePath}: object with ${propCount} properties`)
    } else {
      t.comment(`  ${modulePath}: ${info.exportType}`)
    }
  }

  t.end()
})

test('verify export structure (if snapshot exists)', async (t) => {
  const snapshotPath = path.join(__dirname, 'export-structure.json')

  if (!fs.existsSync(snapshotPath)) {
    t.skip('No snapshot file exists yet')
    t.end()
    return
  }

  const expectedStructure = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'))
  const modules = getAllModules()

  for (const modulePath of modules) {
    const expected = expectedStructure[modulePath]
    if (!expected) {
      t.fail(`Module ${modulePath} not in snapshot`)
      continue
    }

    try {
      const actual = await inspectModule(modulePath)

      t.equal(actual.exportType, expected.exportType,
        `${modulePath}: export type matches`)

      if (actual.exportType === 'object' && actual.properties) {
        const expectedKeys = Object.keys(expected.properties || {}).sort()
        const actualKeys = Object.keys(actual.properties).sort()

        t.same(actualKeys, expectedKeys,
          `${modulePath}: exported property names match`)

        // Check each property's type
        for (const key of actualKeys) {
          if (expected.properties[key]) {
            t.equal(
              actual.properties[key].type,
              expected.properties[key].type,
              `${modulePath}.${key}: type matches`
            )
          }
        }
      }
    } catch (err) {
      t.fail(`Failed to inspect ${modulePath}: ${err.message}`)
    }
  }

  t.end()
})
