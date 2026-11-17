/* =====================================================================
   FILE: src/app/guards/auth.guard.ts
   WHAT: Blocks /profile unless a student is signed in.
   WHY:  A draft belongs to one person. A visitor with no session is
         sent to the login page instead of seeing an empty form.
   ===================================================================== */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Already known this session: do not ask the server again.
  if (auth.currentUser()) {
    return true;
  }

  // After a reload the signal is empty, but the cookie may still be valid.
  return auth.checkSession().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
