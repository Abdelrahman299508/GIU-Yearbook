/* =====================================================================
   FILE: state/students/students.effects.ts
   WHAT: The side effect of the "Load" action: call StudentService.
   WHY:  Reducers must stay pure. Talking to the fake API (and later to
         Laravel) belongs here. The page only dispatches loadStudents.
   ===================================================================== */
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';

import { StudentService } from '../../services/student.service';
import { loadStudents, loadStudentsFailure, loadStudentsSuccess } from './students.actions';
import { selectLoaded } from './students.selectors';

@Injectable()
export class StudentsEffects {
  private readonly actions$ = inject(Actions);
  private readonly studentService = inject(StudentService);
  private readonly store = inject(Store);

  // Skip the request when the list is already in the store. That is what
  // keeps the directory instant when you come back from a profile.
  readonly loadStudents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadStudents),
      withLatestFrom(this.store.select(selectLoaded)),
      filter(([, loaded]) => !loaded),
      switchMap(() =>
        this.studentService.getStudents().pipe(
          map((students) => loadStudentsSuccess({ students })),
          catchError(() =>
            of(
              loadStudentsFailure({
                error: 'We could not load the students. Please try again.',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
