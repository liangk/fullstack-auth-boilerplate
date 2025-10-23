# Controllers

HTTP controllers for the Express backend in StackInsight Auth Lite.

## Philosophy

- **Thin controllers**: validation + mapping only
- **Service-driven**: call services for business logic
- **Typed I/O**: validate inputs with zod; return consistent shapes

## Auth Controller

Endpoints typically provided:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET  /auth/verify-email/:token`
- `POST /auth/resend-verification`
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:token`
- `PUT  /auth/change-password`
- `GET  /auth/me`
- `PUT  /auth/profile`

### Example: register
```ts
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100).optional()
});

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  const result = await authService.register(data);
  return res.status(201).json(result);
}
```

## User Controller

- `GET /users/:id`
- `DELETE /users/account`

### Example: get user by id
```ts
export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  const user = await userService.getById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
}
```

## Dashboard Controller

- `GET /dashboard/stats`
- `GET /dashboard/user-trends`
- `GET /dashboard/activity`
- `GET /dashboard/users`
- `GET /dashboard/users/:userId`
- `GET /dashboard/login-stats`
- `GET /dashboard/export`
- `GET /dashboard/health`

## Error Handling

Controllers should throw domain errors or let zod throw validation errors which are handled centrally by `errorHandler` middleware. See `docs/error-handling.md`.

## Response Shapes

- Wrap structured responses consistently and avoid leaking internals
- Use `data`, `message`, `error`, and `details` conventions across endpoints

## Testing Controllers

- Unit test via supertest against app instance
- Mock services for pure controller tests
- Write E2E tests for happy paths + failure cases
