# Contributing

Thanks for your interest in contributing to StackInsight Auth Lite! This guide explains how to propose changes, report issues, and submit pull requests.

## Code of Conduct

By participating, you agree to uphold our respectful, inclusive community standards.

## Getting Started

- Fork the repository and clone your fork
- Create a feature branch: `git checkout -b feat/your-feature`
- Enable core hooks (format, lint, tests) locally

## Development Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd ../frontend
npm install
npm start

# Docs (Astro)
cd ../docs/astro-docs
npm install
npm run dev
```

## Branch Naming

- `feat/*` for new features
- `fix/*` for bug fixes
- `docs/*` for documentation
- `chore/*` for maintenance tasks

## Commit Messages

Follow Conventional Commits:

- `feat: add passwordless login`
- `fix: refresh token rotation bug`
- `docs: add security best practices`
- `chore: update dependencies`

## Lint & Format

Run linters before pushing:

```bash
# Backend
npm run lint

# Frontend
npm run lint
```

## Tests

Include tests for new functionality when possible:

```bash
# Backend
npm test

# Frontend
npm test
```

## Pull Requests

- Keep PRs focused and small
- Add a clear description of changes
- Link related issues
- Include screenshots for UI changes
- Update docs where relevant

## Issue Reports

When opening an issue, include:
- Steps to reproduce
- Expected vs actual behavior
- Logs or screenshots
- Environment details (OS, Node.js, browser)

## Security

- Do not disclose vulnerabilities publicly
- Report security issues to security@stackinsight.app

## Release Process

- Update `docs/changelog.md`
- Bump version and tag release
- Announce major changes

## Style Guidelines

- TypeScript strict mode
- Prefer interfaces over types
- Avoid `any`
- Small, focused components and services

## Thank You

Your contributions help make StackInsight Auth Lite better for everyone.
