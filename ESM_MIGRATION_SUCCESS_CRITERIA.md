# ESM Migration Success Criteria

## Objective
Convert the semver codebase from CommonJS to ESM while preserving **100% API compatibility**.

## Verification Test
We have a baseline export structure test that captures the **actual runtime exports** of all 47 modules:

**Test file:** `test/export-structure.js`
**Baseline snapshot:** `test/export-structure.json`

### What the test validates:
1. **Export type** (function, object, class) for each module
2. **Property names** for all object exports
3. **Type of each property** (function, object, array, primitive, etc.)
4. **Class detection** (distinguishes classes from regular functions)

### Modules covered:
- ✅ **47 total modules**
  - 3 classes: `Comparator`, `Range`, `SemVer`
  - 24 function modules in `functions/`
  - 11 range modules in `ranges/`
  - 6 internal utilities in `internal/`
  - 3 aggregate exports: `index.js`, `preload.js`, `classes/index.js`

## Success Criteria

### 1. Export Structure Test Passes
```bash
node test/export-structure.js
```
**Must show:** All 164 assertions pass, validating that every module's exports match the baseline.

### 2. Existing Test Suite Passes
```bash
npm test
```
**Must show:** All 64 existing test files pass without modification.

### 3. Manual Import Verification

#### ESM import works:
```bash
node --input-type=module -e "import semver from './index.js'; console.log(semver.valid('1.2.3'))"
# Expected: "1.2.3"
```

#### CommonJS still works (for backwards compatibility):
```bash
node -e "const semver = require('./index.js'); console.log(semver.valid('1.2.3'))"
# Expected: "1.2.3"
```

### 4. ReScript Integration Works
```bash
npx rescript build
```
**Must show:** No module resolution errors with `@rescript/runtime`.

## Key Differences from Previous Attempt

### What went wrong before:
- ❌ Tried to fix issues on the fly
- ❌ Rollup bundling created incorrect CJS output
- ❌ No concrete way to verify exports were correct
- ❌ Manual guessing about export structure

### What we have now:
- ✅ **Data-driven baseline** from actual runtime inspection
- ✅ **164 specific assertions** to verify correctness
- ✅ **Clear pass/fail criteria** before proceeding
- ✅ **Snapshot-based testing** approach

## Migration Strategy

### Phase 1: Convert to ESM (sources only)
1. Add `"type": "module"` to package.json
2. Convert all source files to ESM syntax
3. Fix imports to use `.js` extensions
4. Run export structure test → must pass

### Phase 2: Dual-Package Build (if needed for CJS consumers)
1. Set up build tooling (Rollup or similar)
2. Output both ESM and CJS builds
3. Configure package.json exports field
4. Verify both formats work

### Phase 3: Test Suite
1. Convert test files to ESM or make them work with the new structure
2. Run full test suite → must pass
3. Verify no regressions

## When to Stop and Reassess
If the export structure test fails after migration:
- ❌ **STOP** - Do not proceed further
- 🔍 **Debug** - Identify which modules have incorrect exports
- 🔧 **Fix** - Correct the conversion before continuing
- ✅ **Verify** - Rerun test until it passes

## Current Status
- ✅ Baseline test created and committed
- ✅ 47 modules captured with 164 validation assertions
- ⏳ Ready to begin ESM migration with clear success criteria
