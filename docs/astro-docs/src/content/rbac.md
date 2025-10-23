# Role-Based Access Control (RBAC)

Implementing roles and permissions in StackInsight Auth Lite.

## Concepts

- **User**: An account that authenticates into the system
- **Role**: A named grouping of permissions (e.g., `admin`, `manager`, `user`)
- **Permission**: A capability for a specific action (e.g., `user:read`, `user:write`)

## Data Model Options

### Option A: Simple Roles (Recommended to start)
- Add `role` column to `User` with enum: `admin` | `user`
- Use middleware to enforce access

### Option B: Roles + Permissions (Advanced)
- Tables: `roles`, `permissions`, `role_permissions`, `user_roles`
- Flexible for enterprise use-cases

## Backend Enforcement

### Middleware (Route-Level)
```ts
// requireRole.ts
export function requireRole(...roles: string[]) {
  return (req, res, next) => {
    const user = req.user; // set by auth middleware
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
```

```ts
// routes
app.get('/api/admin/users', authRequired, requireRole('admin'), listUsers);
```

### Service-Level Checks
```ts
function canEditUser(requestingUser: User, targetUser: User) {
  if (requestingUser.role === 'admin') return true;
  return requestingUser.id === targetUser.id; // self-edit only
}
```

## Frontend Enforcement

- Hide admin navigation for non-admin users
- Guard admin routes with `roleGuard`

```ts
// role.guard.ts
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data['roles'] as string[];
  return auth.currentUser$.pipe(
    take(1),
    map(user => {
      if (!user) { router.navigate(['/login']); return false; }
      const ok = roles.some(r => user.role === r);
      if (!ok) router.navigate(['/unauthorized']);
      return ok;
    })
  );
};
```

```ts
// app.routes.ts
{ path: 'admin', component: AdminComponent, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] } }
```

## Common Role Matrix

| Resource | user | admin |
|---|---|---|
| Read own profile | ✅ | ✅ |
| Edit own profile | ✅ | ✅ |
| List users | ❌ | ✅ |
| Edit any user | ❌ | ✅ |
| View dashboard | ✅ | ✅ |

## Auditing

- Log all admin actions (who, what, when)
- Keep immutable records for sensitive updates

## Testing RBAC

- Unit tests for middleware and guards
- E2E tests for restricted screens and APIs

## Migration Plan

1. Add `role` to `User` with default `user`
2. Create admin seed user
3. Protect admin endpoints/ui with guards
4. Add promotion/demotion admin UI (optional)
