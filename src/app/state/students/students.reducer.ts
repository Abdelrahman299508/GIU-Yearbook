/* =====================================================================
   FILE: state/students/students.reducer.ts
   WHAT: The students list, its loading and error flags, and its filters.
   WHY:  This state used to live in the page. The page is destroyed when
         you open a profile, so the list and the search were lost. The
         store lives for the whole app, so they are still here on the
         way back.
   ===================================================================== */
import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { Student } from '../../models/student.model';
import {
  loadStudents,
  loadStudentsFailure,
  loadStudentsSuccess,
  setFaculty,
  setSearchText,
  setSort,
  SortMode,
} from './students.actions';

// The name this slice is registered under in app.config.ts.
export const studentsFeatureKey = 'students';

// An entity adapter stores a list as { ids, entities } so looking up
// one student by id (the profile page) does not scan the whole array.
export const studentsAdapter = createEntityAdapter<Student>();

export interface StudentsState extends EntityState<Student> {
  loading: boolean;
  // empty string means "no error", matching the old page signal.
  error: string;
  // true after the first successful load. Coming back to the directory
  // must not fetch again and flash "Loading students…".
  loaded: boolean;
  searchText: string;
  selectedFaculty: string;
  sortBy: SortMode;
}

export const initialStudentsState: StudentsState = studentsAdapter.getInitialState({
  loading: false,
  error: '',
  loaded: false,
  searchText: '',
  selectedFaculty: 'all',
  sortBy: 'featured',
});

export const studentsReducer = createReducer(
  initialStudentsState,
  on(loadStudents, (state) => (state.loaded ? state : { ...state, loading: true, error: '' })),
  on(loadStudentsSuccess, (state, { students }) =>
    studentsAdapter.setAll(students, { ...state, loading: false, loaded: true, error: '' }),
  ),
  on(loadStudentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(setSearchText, (state, { searchText }) => ({ ...state, searchText })),
  on(setFaculty, (state, { faculty }) => ({ ...state, selectedFaculty: faculty })),
  on(setSort, (state, { sortBy }) => ({ ...state, sortBy })),
);
