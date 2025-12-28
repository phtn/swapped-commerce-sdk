# npm Tags Guide

## Understanding npm Tags

npm tags are labels that point to specific versions of your package. The `latest` tag is the default tag that users get when they install your package without specifying a version.

## Default Behavior

When you publish without specifying a tag, npm automatically uses the `latest` tag:

```bash
npm publish
# This is equivalent to:
npm publish --tag latest
```

## Publishing with Tags

### Publish as Latest (Default)

```bash
# These are equivalent:
npm publish
npm publish --tag latest
npm publish -t latest
```

### Publish with Custom Tags

Useful for pre-releases, beta versions, or specific channels:

```bash
# Publish as beta
npm publish --tag beta
npm publish -t beta

# Publish as next (for upcoming major versions)
npm publish --tag next
npm publish -t next

# Publish as rc (release candidate)
npm publish --tag rc
npm publish -t rc
```

### Example Workflow

```bash
# Version 1.0.0 - publish as latest (default)
npm version 1.0.0
npm publish

# Version 1.1.0-beta.1 - publish as beta
npm version 1.1.0-beta.1
npm publish --tag beta

# Version 2.0.0-rc.1 - publish as rc
npm version 2.0.0-rc.1
npm publish --tag rc

# Version 2.0.0 - publish as latest
npm version 2.0.0
npm publish
```

## Managing Tags

### View Current Tags

```bash
# View all tags for your package
npm dist-tag ls swapped-commerce-sdk

# View tags for any package
npm dist-tag ls <package-name>
```

### Add/Update Tags

```bash
# Add a tag to an existing version
npm dist-tag add swapped-commerce-sdk@1.0.0 beta

# Update latest tag to point to a different version
npm dist-tag add swapped-commerce-sdk@1.0.0 latest

# Remove a tag
npm dist-tag rm swapped-commerce-sdk beta
```

### Move Tags Between Versions

```bash
# Move latest tag from 1.0.0 to 1.1.0
npm dist-tag add swapped-commerce-sdk@1.1.0 latest

# This automatically removes latest from 1.0.0
```

## Installing Packages by Tag

### Install Latest (Default)

```bash
# These are equivalent - both install latest
npm install swapped-commerce-sdk
npm install swapped-commerce-sdk@latest
```

### Install Specific Tags

```bash
# Install beta version
npm install swapped-commerce-sdk@beta

# Install next version
npm install swapped-commerce-sdk@next

# Install rc version
npm install swapped-commerce-sdk@rc
```

### In package.json

```json
{
  "dependencies": {
    "swapped-commerce-sdk": "latest",        // Always latest
    "swapped-commerce-sdk": "beta",          // Always beta
    "swapped-commerce-sdk": "^1.0.0",        // Version range (recommended)
    "swapped-commerce-sdk": "1.0.0"         // Exact version
  }
}
```

## Best Practices

### 1. Use Semantic Versioning

```bash
# Patch release (1.0.0 → 1.0.1) - auto-tags as latest
npm version patch
npm publish

# Minor release (1.0.0 → 1.1.0) - auto-tags as latest
npm version minor
npm publish

# Major release (1.0.0 → 2.0.0) - auto-tags as latest
npm version major
npm publish
```

### 2. Pre-release Workflow

```bash
# Create pre-release version
npm version 1.1.0-beta.1
npm publish --tag beta

# Users can test with:
npm install swapped-commerce-sdk@beta

# When ready, publish as latest
npm version 1.1.0
npm publish  # Automatically tags as latest
```

### 3. Verify Before Publishing

```bash
# Dry-run to see what tag will be used
npm publish --dry-run

# Check what version latest currently points to
npm view swapped-commerce-sdk dist-tags
```

## Common Tag Strategies

### Strategy 1: Latest Only (Simple)

```bash
# Always publish as latest
npm publish
```

### Strategy 2: Latest + Beta

```bash
# Stable releases → latest
npm version 1.0.0
npm publish

# Pre-releases → beta
npm version 1.1.0-beta.1
npm publish --tag beta
```

### Strategy 3: Latest + Next + Beta

```bash
# Current stable → latest
npm publish

# Upcoming major → next
npm version 2.0.0-alpha.1
npm publish --tag next

# Pre-releases → beta
npm version 1.1.0-beta.1
npm publish --tag beta
```

## Checking Package Information

```bash
# View all versions and tags
npm view swapped-commerce-sdk

# View only dist-tags
npm view swapped-commerce-sdk dist-tags

# View specific version
npm view swapped-commerce-sdk@1.0.0

# View what latest points to
npm view swapped-commerce-sdk@latest version
```

## Example: Complete Publishing Workflow

```bash
# 1. Make your changes and commit
git add .
git commit -m "feat: new feature"

# 2. Update version (patch)
npm version patch
# This updates package.json and creates a git tag

# 3. Verify what will be published
npm publish --dry-run

# 4. Publish (automatically uses 'latest' tag)
npm publish

# 5. Verify it's published
npm view swapped-commerce-sdk dist-tags
# Should show: { latest: '1.0.1' }

# 6. Push git tags
git push --follow-tags
```

## Troubleshooting

### Tag Already Exists

If a tag already points to a version, npm will update it:

```bash
# If latest already points to 1.0.0, this updates it to 1.0.1
npm publish
```

### Publishing Pre-release as Latest

By default, pre-release versions (1.0.0-beta.1) won't be tagged as latest unless you explicitly do so:

```bash
# This publishes but does NOT tag as latest
npm version 1.0.0-beta.1
npm publish

# To make it latest (not recommended for pre-releases)
npm publish --tag latest
```

### Check Current Tags Before Publishing

```bash
npm dist-tag ls swapped-commerce-sdk
```

This shows you what tags currently exist and what versions they point to.
