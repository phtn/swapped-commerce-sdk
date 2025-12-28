# Publishing Checklist

## Pre-Publish Verification

### Package Configuration
- [x] Package name: `swapped-commerce-sdk`
- [x] Version: `1.0.0`
- [x] License: MIT
- [x] Files field configured correctly
- [x] .npmignore created
- [x] LICENSE file created
- [x] Repository URL updated (currently placeholder)
- [x] Author field filled (if desired)

### Code Quality
- [x] All tests passing (27 unit tests)
- [x] No linting errors
- [x] TypeScript compiles without errors
- [x] Zero `any` types
- [x] All exports properly typed

### Documentation
- [x] README.md complete and professional
- [x] Examples included
- [x] API documentation complete
- [x] Performance benchmarks documented

### Package Contents (Dry-Run Results)
```
Package size: 17.3 kB
Unpacked size: 65.0 kB
Total files: 27

Included files:
- LICENSE (1.1 kB)
- README.md (27.7 kB)
- package.json (1.5 kB)
- src/ directory (all TypeScript files)
```

### Before Publishing

1. **Update Repository URLs** in `package.json`:
   ```json
   "repository": {
     "type": "git",
     "url": "https://github.com/YOUR-ORG/swapped-commerce-sdk.git"
   },
   "bugs": {
     "url": "https://github.com/YOUR-ORG/swapped-commerce-sdk/issues"
   },
   "homepage": "https://github.com/YOUR-ORG/swapped-commerce-sdk#readme"
   ```

2. **Add Author** (optional):
   ```json
   "author": "Your Name <your.email@example.com>"
   ```

3. **Verify Package**:
   ```bash
   npm pack --dry-run
   ```

4. **Test Installation** (locally):
   ```bash
   npm pack
   npm install ./swapped-commerce-sdk-1.0.0.tgz
   ```

### Publishing Commands

**Dry Run (Test):**
```bash
npm publish --dry-run
```

**Publish to npm (Latest Tag - Default):**
```bash
# These are equivalent - both publish with 'latest' tag
npm publish
npm publish --tag latest
npm publish -t latest
```

**Publish with Custom Tags:**
```bash
# Publish as beta
npm publish --tag beta

# Publish as next (for upcoming versions)
npm publish --tag next

# Publish as rc (release candidate)
npm publish --tag rc
```

**Publish with specific registry:**
```bash
npm publish --registry=https://registry.npmjs.org/
```

**Check Current Tags:**
```bash
# View all tags for your package
npm dist-tag ls swapped-commerce-sdk

# View tags for any package
npm view swapped-commerce-sdk dist-tags
```

**Manage Tags After Publishing:**
```bash
# Add/update a tag to existing version
npm dist-tag add swapped-commerce-sdk@1.0.0 beta

# Move latest tag to different version
npm dist-tag add swapped-commerce-sdk@1.1.0 latest

# Remove a tag
npm dist-tag rm swapped-commerce-sdk beta
```

### Post-Publish

- [ ] Verify package appears on npmjs.com
- [ ] Test installation: `npm install swapped-commerce-sdk`
- [ ] Update documentation with npm installation instructions
- [ ] Create GitHub release (if using GitHub)

### Version Management

For future releases:
- Patch: `npm version patch` (1.0.0 → 1.0.1)
- Minor: `npm version minor` (1.0.0 → 1.1.0)
- Major: `npm version major` (1.0.0 → 2.0.0)

Then: `npm publish`
