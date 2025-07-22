# 🚀 CI/CD Setup Guide

This document explains the comprehensive CI/CD pipeline set up for the `react-history-state` library using GitHub Actions.

## 📋 Overview

Our CI/CD pipeline consists of three main workflows:

1. **🔍 Pull Request Checks** (`pr.yml`) - Quality gates for all PRs
2. **🚀 Release & Publish** (`release.yml`) - Automated publishing to npm
3. **🔒 Security Checks** (`security.yml`) - Security scanning and compliance

## 🔍 Pull Request Workflow

**Triggered on:** PRs to `main` or `develop` branches

### Features:
- ✅ **Multi-Node testing** (Node 18, 20, 21)
- ✅ **Cross-platform builds** (Ubuntu, Windows, macOS)
- ✅ **Quality checks**: Linting, TypeScript, Tests with coverage
- ✅ **Export verification**: Ensures library exports are working
- ✅ **Security audit**: Dependency vulnerability scanning
- ✅ **Draft PR support**: Skips CI for draft PRs
- ✅ **Codecov integration**: Automatic coverage reporting

### What it does:
```yaml
1. Runs on PR open/update/ready_for_review
2. Installs dependencies with pnpm
3. Runs lint, type-check, tests with coverage
4. Builds library and verifies exports
5. Runs security audit
6. Uploads coverage to Codecov
7. Tests build on multiple OS platforms
```

## 🚀 Release & Publish Workflow

**Triggered on:**
- Push to `main` branch (with version changes)
- Manual GitHub releases

### Features:
- ✅ **Smart publishing**: Only publishes on version bumps
- ✅ **Automatic tagging**: Creates Git tags for new versions
- ✅ **GitHub releases**: Auto-generates release notes from CHANGELOG
- ✅ **npm publishing**: Automated publishing to npm registry
- ✅ **Duplicate protection**: Prevents publishing existing versions

### Publishing Process:
```yaml
1. Detects version changes in package.json
2. Runs full test suite before publishing
3. Builds production artifacts
4. Checks if version already exists on npm
5. Publishes to npm registry
6. Creates Git tag
7. Generates GitHub release with changelog
```

### Manual Release:
You can also trigger releases manually:
1. Go to GitHub → Releases → Create new release
2. Create a new tag (e.g., `v1.1.0`)
3. The workflow will automatically publish to npm

## 🔒 Security Workflow

**Triggered on:**
- PRs to `main`
- Push to `main`
- Weekly schedule (Mondays 9 AM UTC)

### Features:
- ✅ **Dependency scanning**: Vulnerability detection in dependencies
- ✅ **CodeQL analysis**: Static code analysis for security issues
- ✅ **License compliance**: Ensures compatible licenses
- ✅ **Bundle analysis**: Detects suspicious code patterns
- ✅ **Supply chain protection**: Monitors for malicious packages

## 🤖 Dependabot Configuration

Automatically keeps dependencies updated:

- ✅ **Weekly updates** every Monday
- ✅ **Grouped updates** by category (TypeScript, testing, build tools)
- ✅ **GitHub Actions updates** kept current
- ✅ **Automatic PR creation** with proper labeling

## 🛠️ Setup Instructions

### 1. Required Secrets

Add these secrets to your GitHub repository:

```bash
# Required for npm publishing
NPM_TOKEN=your-npm-access-token

# Automatically provided by GitHub
GITHUB_TOKEN=automatically-provided
```

### 2. NPM Token Setup

1. Go to [npmjs.com](https://www.npmjs.com) → Access Tokens
2. Generate a new **Automation** token
3. Add it to GitHub: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`
4. Name: `NPM_TOKEN`, Value: your token

### 3. Environment Protection (Optional)

For extra security, set up a `production` environment:

1. Go to `Settings` → `Environments`
2. Create `production` environment
3. Add required reviewers for releases
4. Add environment secrets if needed

### 4. Branch Protection

Configure branch protection for `main`:

```yaml
Require PR reviews: ✅
Require status checks: ✅
  - All PR Checks Complete
  - Security Checks Complete
Require up-to-date branches: ✅
Include administrators: ✅
```

### 5. Codecov Setup (Optional)

1. Go to [codecov.io](https://codecov.io)
2. Connect your repository
3. Coverage reports will be automatically uploaded

## 📊 Workflow Status Badges

Add these badges to your README:

```markdown
[![Tests](https://github.com/yourusername/react-history-state/workflows/🔍%20Pull%20Request%20Checks/badge.svg)](https://github.com/yourusername/react-history-state/actions)
[![Security](https://github.com/yourusername/react-history-state/workflows/🔒%20Security%20Checks/badge.svg)](https://github.com/yourusername/react-history-state/actions)
[![codecov](https://codecov.io/gh/yourusername/react-history-state/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/react-history-state)
```

## 🚀 Release Process

### Automated Release (Recommended)

1. **Make changes** and commit to a feature branch
2. **Create PR** to `main` - CI will run quality checks
3. **Merge PR** after approval
4. **Bump version** in `package.json`:
   ```bash
   # For patch releases (1.0.0 → 1.0.1)
   pnpm version patch

   # For minor releases (1.0.0 → 1.1.0)
   pnpm version minor

   # For major releases (1.0.0 → 2.0.0)
   pnpm version major
   ```
5. **Push changes** - Release workflow will automatically publish to npm

### Manual Release

1. Go to GitHub → Releases
2. Click "Create a new release"
3. Create a new tag (e.g., `v1.1.0`)
4. Add release notes
5. Click "Publish release"
6. Workflow will automatically publish to npm

## 🐛 Troubleshooting

### Common Issues:

**❌ npm publish fails**
- Check `NPM_TOKEN` secret is valid
- Ensure version doesn't already exist on npm
- Check package name is available

**❌ Tests fail on PR**
- Run `pnpm test` locally first
- Check Node version compatibility
- Ensure all dependencies are installed

**❌ Security scan fails**
- Run `pnpm audit` locally
- Update vulnerable dependencies
- Check for suspicious code patterns

**❌ Release workflow doesn't trigger**
- Ensure version in `package.json` actually changed
- Check workflow file syntax
- Verify branch name is exactly `main`

### Debug Commands:

```bash
# Test locally before pushing
pnpm install
pnpm run lint
pnpm run type-check
pnpm test
pnpm run build

# Check for vulnerabilities
pnpm audit

# Verify package contents
npm pack --dry-run
```

## 📈 Monitoring

Monitor your CI/CD pipeline:

1. **GitHub Actions tab**: View workflow runs
2. **Codecov dashboard**: Track test coverage
3. **npm package page**: Verify successful publishes
4. **GitHub Security tab**: Monitor vulnerability alerts

## 🎯 Best Practices

1. **Always test locally** before pushing
2. **Use conventional commits** for better changelog generation
3. **Update CHANGELOG.md** before releases
4. **Keep dependencies updated** with Dependabot
5. **Monitor security alerts** and fix promptly
6. **Review PR checks** before merging
7. **Use semantic versioning** for releases

## 🔄 Workflow Files Location

All workflow files are in `.github/workflows/`:

```
.github/
├── workflows/
│   ├── pr.yml           # PR quality checks
│   ├── release.yml      # Release & publish
│   └── security.yml     # Security scanning
└── dependabot.yml       # Dependency updates
```

---

**💡 Pro Tip**: Set up GitHub notifications to stay informed about workflow status and security alerts!
