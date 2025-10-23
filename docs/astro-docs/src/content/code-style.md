# Code Style Guide

Conventions for StackInsight Auth Lite codebases.

## General Principles
- Prefer readability over cleverness
- Small, composable functions and components
- Strong typing everywhere (TypeScript strict mode)
- Avoid `any`; use interfaces/types

## TypeScript
- Enable `strict`, `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`
- Use `unknown` instead of `any` for untyped inputs
- Prefer interfaces for models (`User`, `LoginRequest`)
- Use `enum`/literal unions for finite values

## Naming
- Files: kebab-case (`user.service.ts`)
- Classes/Components: PascalCase (`AuthService`, `LoginComponent`)
- Functions/vars: camelCase (`getUserById`)
- Constants: UPPER_SNAKE_CASE

## Imports
- Group and order: std libs, third-party, internal
- Absolute or path mapping preferred for deep imports

## Error Handling
- Throw typed errors from services
- Catch in controllers or interceptors and format consistently

## Formatting
- Prettier for formatting
- Max line length 100–120
- Single quotes, semicolons enabled

## Lint Rules (suggested)
- `eqeqeq`: error
- `no-console`: warn (allow in CLI scripts)
- `no-var`: error; prefer `const/let`
- `prefer-const`: error
- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/consistent-type-imports`: error

## Angular
- Standalone components
- Smart vs Presentational pattern
- Use `OnPush` change detection when feasible
- Avoid subscribing in components without unsubscribing; prefer `async` pipe
- Forms: reactive forms preferred
- Use feature folders (`auth/`, `dashboard/`, `shared/`)

## Express
- Thin controllers → Services for logic
- Zod for validation
- Central error middleware
- Request/response DTOs typed

## SCSS
- Use variables and mixins for theme
- Component-scoped styles preferred
- Keep global styles minimal (`styles.scss`)

## Git
- Conventional commits
- Small PRs with clear descriptions

## Reviews
- Request review from at least one other maintainer
- Include tests where appropriate

## Docs
- Update documentation alongside code changes
- Keep changelog updated for notable changes
