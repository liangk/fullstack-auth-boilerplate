# Testing Guide

Testing strategy for StackInsight Auth Lite.

## Types of Tests
- **Unit Tests**: Functions, services, controllers
- **Integration Tests**: API endpoints with in-memory or test DB
- **E2E Tests**: Full-stack flows (optional)

## Backend (Jest)

### Setup
```bash
cd backend
npm install --save-dev jest ts-jest @types/jest supertest
npx ts-jest config:init
```

`jest.config.js`:
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)']
};
```

### Unit Test Example (Service)
```ts
describe('AuthService', () => {
  it('hashes and verifies passwords', async () => {
    const hash = await service.hashPassword('Password123');
    expect(await service.verifyPassword('Password123', hash)).toBe(true);
  });
});
```

### Integration Test Example (Controller)
```ts
import request from 'supertest';
import app from '../src/app';

describe('Auth Controller', () => {
  it('registers a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'a@b.com', password: 'Password123' })
      .expect(201);
    expect(res.body.user.email).toBe('a@b.com');
  });
});
```

## Frontend (Karma/Jasmine)

### Unit Test Example (Service)
```ts
describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('gets stats', () => {
    const mock = { totalUsers: 1 } as any;
    service.getStats().subscribe(data => expect(data).toEqual(mock));
    const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/stats`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});
```

## E2E (Cypress/Playwright)

### Example Flow
- Register → Verify Email → Login → View Dashboard

```bash
# cypress
npx cypress open
```

```ts
it('registers and logs in', () => {
  cy.visit('/register');
  cy.get('[data-cy=email]').type('user@example.com');
  cy.get('[data-cy=password]').type('Password123');
  cy.get('[data-cy=submit]').click();
  // ...mock verification or handle maildev
  cy.visit('/login');
  cy.get('[data-cy=email]').type('user@example.com');
  cy.get('[data-cy=password]').type('Password123');
  cy.get('[data-cy=submit]').click();
  cy.contains('Dashboard');
});
```

## Test Data

- Use factories/builders for test entities
- Reset DB between tests (transactions or truncate)

## CI Setup

- Run tests in GitHub Actions
- Cache node_modules
- Use a Postgres service for backend tests

## Coverage

- Target 80%+ coverage on core modules
- Exclude generated files and configurations

## Tips

- Keep tests deterministic
- Name test blocks clearly
- Use data-cy attributes in templates for selectors
