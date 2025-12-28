# Troubleshooting Guide

## Build Errors

### "Missing module type" Error

If you encounter this error when using the SDK:

```
Missing module type
./node_modules/swapped-commerce-sdk/src/index.ts
```

**Solution:**

The package now includes compiled JavaScript files. Ensure you're using version 1.0.1 or later which includes the `dist/` directory with compiled ESM modules.

**For Bundlers (Vite, Webpack, etc.):**

The package exports are configured to use the compiled JavaScript:

```json
{
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./src/index.ts"
}
```

If your bundler still has issues, you may need to configure it:

**Vite:**
```typescript
// vite.config.ts
export default {
  resolve: {
    alias: {
      'swapped-commerce-sdk': 'swapped-commerce-sdk/dist/index.js'
    }
  }
}
```

**Webpack:**
```javascript
// webpack.config.js
module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    mainFields: ['module', 'main']
  }
}
```

**TypeScript:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "resolveJsonModule": true
  }
}
```

### TypeScript Import Errors

If TypeScript can't find types:

1. Ensure you have TypeScript installed:
   ```bash
   npm install -D typescript
   ```

2. The package includes source TypeScript files for type definitions. TypeScript should automatically resolve them via the `types` field in package.json.

3. If using a bundler, ensure it's configured to preserve type information.

## Runtime Errors

### "Cannot find module" in Node.js

If using Node.js (not Bun), ensure you're using Node.js 18+ with ESM support:

```json
// package.json
{
  "type": "module"
}
```

Or use `.mjs` extension for your files.

### Web Crypto API Not Available

The SDK uses Web Crypto API for webhook verification. If you're in an environment without Web Crypto:

- Node.js 18+: Web Crypto is available globally
- Bun: Web Crypto is available globally
- Browsers: Web Crypto is available in modern browsers
- Older Node.js: Use `node --experimental-webcrypto` or polyfill

## Installation Issues

### Package Not Found

If `npm install swapped-commerce-sdk` fails:

1. Check you're logged into npm:
   ```bash
   npm whoami
   ```

2. Verify the package exists:
   ```bash
   npm view swapped-commerce-sdk
   ```

3. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

## Performance Issues

### Slow Import Times

The SDK is optimized for performance. If you experience slow imports:

1. Ensure you're using the compiled version (dist/index.js)
2. Check your bundler configuration isn't processing unnecessary files
3. Use tree-shaking to only import what you need

### Memory Issues

The SDK uses minimal memory. If you see memory issues:

1. Ensure you're reusing client instances (don't create new ones for each request)
2. Check for memory leaks in your application code
3. The SDK itself has zero memory leaks

## Getting Help

If you continue to experience issues:

1. Check the [GitHub Issues](https://github.com/phtn/swapped-commerce-sdk/issues)
2. Review the [API Documentation](https://docs.swapped.com/swapped-commerce/commerce-integration)
3. Ensure you're using the latest version: `npm view swapped-commerce-sdk version`
