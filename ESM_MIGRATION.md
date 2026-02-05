# ESM Migration Plan

## Overview
Convert the entire semver codebase from CommonJS to ES Modules (ESM) to enable compatibility with ReScript's @rescript/runtime and modern JavaScript tooling.

**Important:** We'll use a **dual-package strategy** - source code in ESM, but publish both ESM and CommonJS builds for backward compatibility.

## Motivation
- ReScript's runtime package (`@rescript/runtime`) is configured as ESM (`"type": "module"`)
- Mixing CommonJS and ESM causes module resolution conflicts
- ESM is the modern JavaScript standard and future-proof
- **Dual builds ensure backward compatibility** for downstream CommonJS consumers

## Migration Scope

### Files to Convert (~50 files)
- **Internal utilities**: `internal/*.js` (6 files)
- **Core classes**: `classes/*.js` (4 files)
- **Functions**: `functions/*.js` (24 files)
- **Ranges**: `ranges/*.js` (11 files)
- **Bin**: `bin/semver.js` (1 file)
- **Entry points**: `index.js`, `preload.js` (2 files)
- **Tests**: `test/**/*.js` (~64 test files)

## Conversion Patterns

### 1. Package.json
```json
{
  "type": "module"
}
```

### 2. Import/Export Patterns

**Named exports:**
```javascript
// Before (CJS)
module.exports = { compareIdentifiers, rcompareIdentifiers }

// After (ESM)
export { compareIdentifiers, rcompareIdentifiers }
```

**Default exports:**
```javascript
// Before (CJS)
module.exports = debug

// After (ESM)
export default debug
```

**Imports:**
```javascript
// Before (CJS)
const { compareIdentifiers } = require('../internal/identifiers')

// After (ESM)
import { compareIdentifiers } from '../internal/identifiers.js'
```

### 3. File Extensions
- **CRITICAL**: ESM requires explicit `.js` extensions in import paths
- Example: `'./identifiers'` → `'./identifiers.js'`

### 4. Special Cases

**__dirname and __filename:**
```javascript
// Before (CJS)
__dirname
__filename

// After (ESM)
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
```

**Dynamic imports:**
```javascript
// Before (CJS)
const mod = require(dynamicPath)

// After (ESM)
const mod = await import(dynamicPath)
```

## Migration Strategy

### Option A: Big Bang (Recommended)
Convert all files at once in a single commit/PR:
- **Pros**: Clean cutover, no mixed CJS/ESM state, easier to test
- **Cons**: Large changeset, higher risk
- **Approach**: Use automated tooling + manual verification

### Option B: Incremental
Convert file-by-file using `.mjs` extensions:
- **Pros**: Smaller changes, easier to review
- **Cons**: Complex interop, longer migration period
- **Approach**: Not recommended for this codebase size

### Recommended: Option A

## Dual-Package Strategy

To maintain backward compatibility, we'll publish both ESM and CommonJS builds:

### Source Code (ESM)
- Write all code in ESM format
- Enables use of ReScript with @rescript/runtime
- Modern, future-proof approach

### Build Outputs
1. **ESM** (for modern consumers):
   - Location: `dist/esm/` or root with `"type": "module"`
   - Used by: Bundlers, modern Node.js (with `import`)

2. **CommonJS** (for legacy consumers):
   - Location: `dist/cjs/`
   - Used by: Older Node.js, projects still using `require()`

### Package.json Configuration
```json
{
  "type": "module",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js"
    },
    "./package.json": "./package.json"
  }
}
```

### Build Tools Options

**Option 1: Use Rollup/esbuild**
- Bundle ESM source → output both ESM and CJS
- Pros: Full control, well-tested
- Cons: Extra build step, tooling complexity

**Option 2: Use tsc (TypeScript Compiler)**
- If we add TypeScript, can output both formats
- Pros: Type safety, dual output built-in
- Cons: Requires TypeScript migration

**Option 3: Use babel**
- Transform ESM → CJS with @babel/preset-env
- Pros: Simple, widely used
- Cons: Extra dependency

**Recommended: Option 1 (Rollup)** - fast, simple, no extra languages

## Implementation Steps

### Phase 1: Preparation
1. ✅ Create ESM migration plan
2. ✅ Write conversion script (`scripts/convert-to-esm.js`)
3. Create a new branch `esm-migration`
4. Verify all dependencies support ESM (check package.json)

### Phase 2: Automated Conversion
Run the conversion script:
1. Execute `node scripts/convert-to-esm.js`
2. Review the generated report
3. Manually update `package.json` to add `"type": "module"`
4. Review git diff for accuracy

### Phase 3: Setup Dual-Package Build
1. Install Rollup: `npm install --save-dev rollup`
2. Create `rollup.config.js` for dual builds (ESM + CJS)
3. Update package.json:
   - Add build scripts
   - Configure "exports" field
   - Set "main" and "module" fields
4. Add `dist/` to .gitignore
5. Update .npmignore to include dist/

### Phase 4: Manual Fixes
1. Handle any `__dirname`/`__filename` usage (if found)
2. Fix dynamic requires (if found)
3. Fix any edge cases the script flagged
4. Update any tool configs that need ESM support

### Phase 5: Testing
1. Build dual packages: `npm run build`
2. Test ESM build: `node --input-type=module -e "import './dist/esm/index.js'"`
3. Test CJS build: `node -e "require('./dist/cjs/index.js')"`
4. Run full test suite: `npm test`
5. Run ReScript compiler: `npx rescript build`
6. Fix any runtime errors
7. Iterate until all tests pass

### Phase 6: Validation & Commit
1. Verify all tests pass (64/64)
2. Check for any regressions
3. Update documentation/changelog
4. Commit with clear message
5. Push and create PR

## Risks & Mitigations

### Risk 1: Test Framework Compatibility
- **Risk**: Tap might not support ESM fully
- **Mitigation**: Check tap docs, update to latest version, or consider alternatives

### Risk 2: Breaking Changes for Consumers
- **Risk**: Downstream packages using CommonJS might break
- **Mitigation**: This is a major version bump, document in changelog

### Risk 3: Tooling Compatibility
- **Risk**: ESLint, benchmarks, other tools might need updates
- **Mitigation**: Test all tooling, update configs as needed

## Success Criteria
- [ ] All source files converted to ESM
- [ ] Dual-package build working (ESM + CJS outputs)
- [ ] ESM build can be imported in Node.js ESM
- [ ] CJS build can be required in Node.js CommonJS
- [ ] All tests pass (64/64)
- [ ] ReScript builds successfully without runtime conflicts
- [ ] No regressions in functionality
- [ ] CI/CD pipeline passes
- [ ] package.json exports configured correctly
- [ ] Documentation updated

## Automation Tools to Consider
- **jscodeshift**: Facebook's code transformation toolkit
- **lebab**: Transforms ES5 code to ES6/ES7
- **cjs-to-es6**: Specialized CJS to ESM converter
- **Manual**: sed/awk for simple pattern replacements

## Next Steps
1. Review this plan
2. Choose automation approach
3. Create feature branch
4. Execute conversion
5. Test thoroughly
6. Merge and release as major version
