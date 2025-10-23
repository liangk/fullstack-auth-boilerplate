# Changelog

All notable changes to StackInsight Auth Lite will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [Unreleased]
- Documentation refinements
- Performance improvements

## [1.0.0] - 2025-10-23
### Added
- Initial release of StackInsight Auth Lite
- Secure auth: HTTP-only cookies, refresh token rotation, email verification
- Auth flows: register, login, logout, refresh, verify email, reset password
- Admin dashboard: stats, trends, activity log (API)
- Angular frontend with Material and responsive layout
- Docker Compose for full dev stack (db, backend, frontend, maildev)
- CI workflows (Frontend/Backend) and environment scaffolding
- Comprehensive documentation site (Astro) with guides and API refs

### Changed
- Rebranded from "Fullstack Auth Boilerplate" to "StackInsight Auth Lite"

### Security
- Helmet headers and CORS policies for production
- Rate limiting for auth-sensitive endpoints

[Unreleased]: https://github.com/liangk/fullstack-auth-boilerplate/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/liangk/fullstack-auth-boilerplate/releases/tag/v1.0.0
