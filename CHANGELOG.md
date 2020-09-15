# fast-url

## 6.0.1

### Patch Changes

- 9d48494: Add `--allow-dirty` flag to fix JSR publish command

## 6.0.0

### Major Changes

- d14ac79: **BREAKING CHANGE**: Renamed default export from `urlcat` to `createUrl` and changed from default export to named export for better clarity and JSR.io compliance

  ### JSR.io Compliance

  Made the package fully compliant with JSR.io (JavaScript Registry) requirements:

  - Added comprehensive module documentation to all entrypoints with `@module` tags
  - Added JSDoc documentation for all exported symbols (100% coverage)
  - Added usage examples in module documentation
  - Enhanced TypeScript type safety with proper documentation for `ParamMap` type
  - Verified no slow types are used (strict mode enabled)

  ### Breaking Changes

  - **Renamed**: Function changed from `urlcat` to `createUrl`
  - **Export Type**: Changed from default export to named export

    ```typescript
    // Before
    import urlcat from "fast-url";
    urlcat("https://api.example.com", "/users/:id", { id: 42 });

    // After
    import { createUrl } from "fast-url";
    createUrl("https://api.example.com", "/users/:id", { id: 42 });
    ```

  ### Migration Guide

  Update your imports and function calls:

  1. Replace `import urlcat from 'fast-url'` with `import { createUrl } from 'fast-url'`
  2. Replace all `urlcat(...)` calls with `createUrl(...)`
  3. For CommonJS: Replace `const urlcat = require('fast-url').default` with `const { createUrl } = require('fast-url')`

  The API and all utility functions (`query`, `subst`, `join`) remain unchanged and fully compatible.

  ### Documentation Improvements

  - Enhanced JSDoc comments with better examples
  - Added module-level documentation for better IDE support
  - Improved type definitions for JSR.io compatibility
  - All exported symbols now have comprehensive documentation

## 5.0.1

### Patch Changes

- d5e9f97: Add documentation and update homepage

## 5.0.0

### Major Changes

- cf2abf5: This pull request introduces a major modernization and optimization of the querystring module, aligning it closely with the latest Node.js implementation while improving performance, expanding test coverage, and enhancing developer tooling and documentation. The update brings a faster, more consistent, and fully cross-environment compatible querystring implementation, with comprehensive benchmarks and no breaking changes.

  **Querystring Module Modernization & Optimization**

  - Replaced the `src/querystring/node.ts` implementation with an optimized version based on the latest Node.js source, featuring direct constant access and inlined logic for `encodeString`, resulting in a 5-20% performance improvement and matching or exceeding the legacy implementation. [[1]](diffhunk://#diff-0453925e3cc7ea1788c0b323ed15f500ac460437a2b1d6d7b913579f33ea274fR1-R120) [[2]](diffhunk://#diff-a2a171449d862fe29692ce031981047d7ab755ae7f84c707aef80701b3ea0c80L1-R1)
  - Updated the `stringify` function to use the new `encodeString` and improved primitive handling for efficient query string serialization.
  - Refactored imports in `src/index.ts` to use the new querystring path, ensuring all code uses the updated implementation.

  **Testing & Benchmarking Enhancements**

  - Expanded the test suite to 95 tests (including new tests for `isHexTable`) and introduced comprehensive benchmarks comparing old, new, and optimized implementations, with all tests passing and benchmarks confirming negligible real-world performance differences. [[1]](diffhunk://#diff-b1255cb5753ee281e39df01d1270d6b0bdad8fa4dd0476d53e278280f4ffa8d1R1-R119) [[2]](diffhunk://#diff-14e40eac46f8bc6dc4729aa2106d6980ef015e09358a51d4649e6243ff738357R1-R25)
  - Added detailed documentation and summary files (`QUERYSTRING_UPDATE_SUMMARY.md`, `OPTIMIZATION_GUIDE.md`) explaining the update, performance comparisons, and optimization techniques. [[1]](diffhunk://#diff-b1255cb5753ee281e39df01d1270d6b0bdad8fa4dd0476d53e278280f4ffa8d1R1-R119) [[2]](diffhunk://#diff-059db6f886c62bfbe786f10ebcd4dace1c268a8df5f97249ae234e7a0e780202R1-R169) [[3]](diffhunk://#diff-14e40eac46f8bc6dc4729aa2106d6980ef015e09358a51d4649e6243ff738357R1-R25)

  **Developer Experience & Tooling Improvements**

  - Added new linting rules and enabled the Biome "nursery" ruleset in `biome.json` for improved code consistency and style enforcement. [[1]](diffhunk://#diff-2bc8a1f5e9380d5a187a4e90f11b4dd36c3abad6aea44c84be354a4f44cdec55L24-R42) [[2]](diffhunk://#diff-2bc8a1f5e9380d5a187a4e90f11b4dd36c3abad6aea44c84be354a4f44cdec55R52-R58) [[3]](diffhunk://#diff-14e40eac46f8bc6dc4729aa2106d6980ef015e09358a51d4649e6243ff738357R1-R25)
  - Added `@types/node` to `devDependencies` for improved type support. [[1]](diffhunk://#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519L39-R44) [[2]](diffhunk://#diff-14e40eac46f8bc6dc4729aa2106d6980ef015e09358a51d4649e6243ff738357R1-R25)
  - Updated `vitest.config.mts` to support path aliasing for cleaner imports using `@`.

  **Documentation & Security**

  - Added a `SECURITY.md` policy outlining supported versions, vulnerability reporting, and best practices. [[1]](diffhunk://#diff-f6ed156e4bf5c791680662464b94ea5d753f219ee816b385f67870e2c0d7d4c7R1-R84) [[2]](diffhunk://#diff-14e40eac46f8bc6dc4729aa2106d6980ef015e09358a51d4649e6243ff738357R1-R25)
  - Updated the README to clarify Unicode handling capabilities, highlighting the use of `codePointAt` for proper Unicode encoding. [[1]](diffhunk://#diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5R19) [[2]](diffhunk://#diff-14e40eac46f8bc6dc4729aa2106d6980ef015e09358a51d4649e6243ff738357R1-R25)

  Overall, this update modernizes and optimizes the querystring module, improves performance, expands test coverage, and enhances developer tooling, with no breaking changes and full cross-environment compatibility.

## 4.0.2

### Patch Changes

- 75521d2: Modernize development infrastructure and CI/CD workflows:

  - Migrate from npm to Bun for faster package management
  - Replace Jest with Vitest for improved test performance
  - Switch from ESLint to Biome for unified linting and formatting
  - Adopt mise for consistent toolchain management across environments
  - Add Changesets for automated version management and releases
  - Implement step-security/harden-runner for enhanced workflow security
  - Set up automated code fixes with autofix.ci
  - Add CodSpeed benchmarking integration
  - Configure OIDC authentication for Codecov uploads
  - Add OpenSSF Scorecard for supply-chain security monitoring

## 4.0.1

### Patch Changes

- 5c5463b: Add `sideEffects: false` to enable better tree-shaking optimization

## 4.0.0

### Major Changes

- c7a163d: ## Major Performance and API Overhaul

  ### 🚀 Performance Improvements

  - **Replace `qs` dependency with `fast-querystring`**: Significant performance boost for query string serialization with smaller bundle size
  - **Optimized internal implementations**: Improved regex patterns and streamlined parameter handling for better runtime performance
  - **Reduced bundle size**: Elimination of heavy `qs` dependency and related configuration overhead

  ### 💥 Breaking Changes

  #### Removed `configure` API

  - **REMOVED**: `configure()` function and `UrlCatConfiguration` type
  - **REMOVED**: Support for `arrayFormat` options (repeat, comma, brackets, indices)
  - **REMOVED**: Support for `objectFormat.format` options (RFC1738, RFC3986)
  - **IMPACT**: All query parameters now use `fast-querystring`'s default encoding behavior

  #### API Simplification

  - **REMOVED**: 4-parameter overload `urlcat(baseUrl, path, params, config)`
  - **SIMPLIFIED**: Only 3 core overloads remain:
    - `urlcat(baseTemplate, params)`
    - `urlcat(baseUrl, path)`
    - `urlcat(baseUrl, pathTemplate, params)`

  #### Query String Behavior Changes

  - **Spaces**: Now encoded as `%20` instead of `+` (RFC3986 vs RFC1738)
  - **Arrays**: Default serialization only (no custom arrayFormat support)
  - **Objects**: Simplified serialization without format configuration

  ### 🔧 Internal Improvements

  - **Regex optimization**: Simplified path parameter matching from `/:[_A-Za-z]+[_A-Za-z0-9]*/g` to `/:[_A-Za-z]+\w*/g`
  - **Better type safety**: More precise parameter validation and type constraints
  - **Cleaner implementation**: Reduced complexity in `urlcatImpl` and related functions
  - **Enhanced null/undefined filtering**: More efficient parameter cleanup

  ### 📚 Documentation Updates

  - Updated all examples to reflect new API
  - Removed configuration-related documentation
  - Updated installation instructions to prefer `bun`
  - Refreshed build and development workflow documentation

  ### 🛠 Development Experience

  - **Build tool migration**: Full migration from npm to bun for faster development
  - **Updated tooling**: Biome integration for linting and formatting
  - **Simplified scripts**: Streamlined package.json scripts for better DX
