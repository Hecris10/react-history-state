# Governance

This document outlines the governance model for the `react-history-state`
project, following [open governance principles](https://opengovernance.dev/) and
[open source leadership best practices](https://opensource.guide/leadership-and-governance/).

## Project Vision

React History State aims to provide a reliable, performant, and
developer-friendly state management solution with undo/redo capabilities for
React applications.

## Roles and Responsibilities

### 🛡️ Maintainers

**Current Maintainers:**

- [Helaman Ewerton] (@Hecris10) - Project Lead & Maintainer

**Responsibilities:**

- Set project vision and roadmap
- Review and merge pull requests
- Manage releases and versioning
- Enforce code of conduct
- Make final decisions on breaking changes
- Mentor contributors and help them become maintainers

**How to Become a Maintainer:**

1. Consistently contribute high-quality code, documentation, or community
   support
2. Demonstrate deep understanding of the project architecture
3. Show commitment to the project's long-term success
4. Be nominated by an existing maintainer
5. Receive approval from majority of current maintainers

### 👥 Contributors

**Anyone can be a contributor by:**

- Reporting bugs or suggesting features
- Submitting pull requests
- Improving documentation
- Helping others in issues and discussions
- Writing tutorials or blog posts
- Speaking about the project at conferences

**Recognition:**

- All contributors are listed in the README
- Significant contributors receive special recognition
- Outstanding contributors may be invited to become maintainers

### 🎯 Core Team

For projects that grow beyond a single maintainer, we may form a core team with
specialized roles:

- **Technical Lead** - Architecture and technical decisions
- **Release Manager** - Version management and publishing
- **Community Manager** - Issue triage and community engagement
- **Security Officer** - Security reviews and vulnerability management

## Decision Making Process

### 📊 Consensus Model

We strive for **consensus** on all major decisions:

1. **Proposal** - Any contributor can propose changes via GitHub Issues
2. **Discussion** - Open discussion period (minimum 7 days for major changes)
3. **Feedback Integration** - Proposal updated based on feedback
4. **Consensus Check** - Maintainers assess if consensus is reached
5. **Implementation** - Approved changes are implemented

### 🗳️ Voting (when consensus isn't possible)

For decisions where consensus cannot be reached:

- **Maintainer Vote** - Each maintainer has one vote
- **Simple Majority** - 50%+ approval needed
- **Tie Breaking** - Project lead has tie-breaking vote
- **Veto Power** - Any maintainer can veto security-sensitive changes

### ⚡ Fast-Track Decisions

Some decisions can be made quickly:

- **Bug fixes** - Can be merged with single maintainer approval
- **Documentation updates** - Can be merged with single maintainer approval
- **Dependency updates** - Automated via Dependabot
- **Security fixes** - Immediate merge authority for security officer

## Communication Channels

### 📢 Primary Channels

- **GitHub Issues** - Bug reports, feature requests, discussions
- **GitHub Discussions** - General community discussion
- **Pull Requests** - Code review and technical discussion

### 🔒 Private Channels

- **Security Issues** - security@[domain] (when we have one)
- **Maintainer Decisions** - Private issues when needed for sensitive topics

## Code Standards and Quality

### ✅ All Contributions Must:

- Pass all automated tests (30/30 passing)
- Meet code coverage requirements (>90%)
- Follow TypeScript strict mode requirements
- Pass ESLint with zero warnings
- Include appropriate documentation
- Follow conventional commit format

### 🔍 Review Requirements

- **All PRs require** at least one maintainer approval
- **Breaking changes require** discussion period + maintainer consensus
- **Security changes require** security officer approval
- **Documentation PRs** can be fast-tracked

## Release Process

### 📦 Versioning

We follow [Semantic Versioning 2.0.0](https://semver.org/):

- **PATCH** (1.0.1) - Bug fixes, security patches
- **MINOR** (1.1.0) - New features, backward compatible
- **MAJOR** (2.0.0) - Breaking changes

### 🚀 Release Authority

- **Patch releases** - Any maintainer can initiate
- **Minor releases** - Requires maintainer consensus
- **Major releases** - Requires maintainer consensus + community consultation

### 📋 Release Checklist

1. All tests passing
2. Changelog updated
3. Version bumped in package.json
4. Documentation updated
5. Security review completed (for significant changes)
6. Community notification
7. npm publish
8. GitHub release created
9. Social media announcement (optional)

## Conflict Resolution

### 🤝 Process

1. **Direct Discussion** - Encouraged first step
2. **Maintainer Mediation** - Maintainer helps facilitate resolution
3. **Community Input** - Bring discussion to GitHub Discussions
4. **Maintainer Decision** - Final authority if needed
5. **Appeal Process** - Can appeal to all maintainers

### 🚫 Code of Conduct Violations

Violations of our [Code of Conduct](.github/CODE_OF_CONDUCT.md) will be handled
according to the enforcement procedures outlined there.

## Project Assets and Ownership

### 🏛️ Asset Control

Following [open governance principles](https://opengovernance.dev/):

- **GitHub Repository** - Owned by maintainer, with multiple admin access
- **NPM Package** - Published under maintainer account, with multiple owners
- **Domain Names** - If acquired, will be neutrally owned
- **Trademarks** - Will be donated to appropriate foundation if needed

### 💰 Financial Governance

Currently self-funded. If the project receives donations or sponsorships:

- **Transparency** - All financial activity will be public
- **Usage Decisions** - Maintainer consensus required
- **Options** - May join fiscal sponsor (Software Freedom Conservancy, etc.)

## Amendment Process

This governance document can be amended by:

1. **Proposal** - Submit PR with proposed changes
2. **Discussion Period** - Minimum 14 days for feedback
3. **Maintainer Approval** - Unanimous maintainer approval required
4. **Community Notice** - Changes announced to community

## Getting Help

### 📞 Contact

- **General Questions** - GitHub Discussions
- **Bug Reports** - GitHub Issues
- **Security Issues** - Create private security advisory
- **Governance Questions** - Tag maintainers in GitHub Discussions

### 🆘 Maintainer Availability

We aim to respond to:

- **Security issues** - Within 24 hours
- **Bug reports** - Within 3 business days
- **Feature requests** - Within 1 week
- **General questions** - Within 1 week

---

_This governance model is based on successful open source projects and follows
industry best practices for [open governance](https://opengovernance.dev/) and
[leadership patterns](https://opensource.guide/leadership-and-governance/)._
