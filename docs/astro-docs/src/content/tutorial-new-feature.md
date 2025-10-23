# Tutorial: Adding a New Feature

Step-by-step guide to add a simple "Profile Bio" feature to StackInsight Auth Lite.

## Goal

- Add a `bio` field to user profile
- API endpoints to get/update bio
- Update Angular UI to edit and display bio

## 1) Backend: Database

Add a `bio` field to the `User` model (Prisma):

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  isVerified Boolean @default(false)
  bio       String?  // NEW
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Run migration:
```bash
npx prisma migrate dev --name add_user_bio
```

## 2) Backend: API

Add controller methods:
```ts
// GET /auth/profile
export async function getProfile(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, name: true, bio: true, isVerified: true }
  });
  res.json({ user });
}

// PUT /auth/profile
export async function updateProfile(req: Request, res: Response) {
  const { name, bio } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, bio }
  });
  res.json({
    message: 'Profile updated successfully',
    user: { id: user.id, email: user.email, name: user.name, bio: user.bio, isVerified: user.isVerified }
  });
}
```

Validate input with zod:
```ts
const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional()
});
```

## 3) Frontend: Models

```ts
// src/app/models/user.model.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string; // NEW
  isVerified: boolean;
}
```

## 4) Frontend: Service

```ts
// auth.service.ts
updateProfile(data: { name?: string; bio?: string }): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/profile`, data, { withCredentials: true }).pipe(
    tap(user => this.setCurrentUser(user))
  );
}
```

## 5) Frontend: UI

Add fields to profile form component:
```html
<mat-form-field appearance="outline">
  <mat-label>Name</mat-label>
  <input matInput [(ngModel)]="model.name" />
</mat-form-field>

<mat-form-field appearance="outline">
  <mat-label>Bio</mat-label>
  <textarea matInput rows="4" [(ngModel)]="model.bio" maxlength="500"></textarea>
  <mat-hint align="end">{{ model.bio?.length || 0 }}/500</mat-hint>
</mat-form-field>

<button mat-raised-button color="primary" (click)="save()">Save</button>
```

```ts
model = { name: this.user?.name, bio: this.user?.bio };

save() {
  this.authService.updateProfile(this.model).subscribe({
    next: () => this.snackBar.open('Saved', 'Close', { duration: 2000 }),
    error: err => this.errorService.handleError(err)
  });
}
```

## 6) Tests

- Unit test service `updateProfile`
- E2E test: update bio and verify display

## 7) Rollout

- Run DB migration in staging, then production
- Add changelog entry
- Announce in release notes

## Done

You’ve added a full-stack feature touching DB, API, UI, and tests.
