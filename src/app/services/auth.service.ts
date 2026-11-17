/* =====================================================================
   FILE: src/app/services/auth.service.ts
   WHAT: Who is signed in, if anyone.
   WHY:  The profile page and the route guard both need the same answer.
         A root service is that one answer.
   ===================================================================== */
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';

export interface User {
  studentId: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** null means the visitor is signed out. */
  readonly currentUser = signal<User | null>(null);

  /** Ask the server whether the login cookie is still valid. */
  checkSession(): Observable<User> {
    return this.http
      .get<User>(`${environment.apiUrl}/session`)
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
