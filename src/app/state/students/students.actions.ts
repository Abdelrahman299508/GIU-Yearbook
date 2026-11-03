/* =====================================================================
   FILE: state/students/students.actions.ts
   WHAT: The events the students feature understands.
   WHY:  A component does not edit the store. It reports what happened
         ("load", "the user typed", "the request failed") and a reducer
         decides the next state.
   ===================================================================== */
import { createAction, props } from '@ngrx/store';

import { Student } from '../../models/student.model';

// Only these two sort options exist in the dropdown.
export type SortMode = 'featured' | 'name';

// The page asks for the list. The effect is what actually calls the API.
export const loadStudents = createAction('[Students] Load');

export const loadStudentsSuccess = createAction(
  '[Students] Load Success',
  props<{ students: Student[] }>(),
);

export const loadStudentsFailure = createAction(
  '[Students] Load Failure',
  props<{ error: string }>(),
);

// Filters live in the store too, so a search survives a trip to a profile.
export const setSearchText = createAction(
  '[Students] Set Search Text',
  props<{ searchText: string }>(),
);

export const setFaculty = createAction('[Students] Set Faculty', props<{ faculty: string }>());

export const setSort = createAction('[Students] Set Sort', props<{ sortBy: SortMode }>());
