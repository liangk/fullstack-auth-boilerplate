import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.checkAuth().pipe(
    tap(isAuthed => {
      if (!isAuthed) router.navigate(['/login']);
    }),
    map(isAuthed => isAuthed)
  );
};
