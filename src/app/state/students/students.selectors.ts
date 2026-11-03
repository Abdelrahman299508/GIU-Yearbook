/* =====================================================================
   FILE: state/students/students.selectors.ts
   WHAT: Read-only questions the templates ask the store.
   WHY:  A selector is the store's version of computed(). Filtering is
         calculated from the list, never stored a second time.
   ===================================================================== */
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StudentsState, studentsAdapter, studentsFeatureKey } from './students.reducer';

export const selectStudentsState = createFeatureSelector<StudentsState>(studentsFeatureKey);

const { selectAll, selectEntities } = studentsAdapter.getSelectors();

export const selectAllStudents = createSelector(selectStudentsState, selectAll);
export const selectStudentEntities = createSelector(selectStudentsState, selectEntities);

export const selectLoading = createSelector(selectStudentsState, (state) => state.loading);
export const selectErrorMessage = createSelector(selectStudentsState, (state) => state.error);
export const selectLoaded = createSelector(selectStudentsState, (state) => state.loaded);
export const selectSearchText = createSelector(selectStudentsState, (state) => state.searchText);
export const selectSelectedFaculty = createSelector(
  selectStudentsState,
  (state) => state.selectedFaculty,
);
export const selectSortBy = createSelector(selectStudentsState, (state) => state.sortBy);

// The faculty dropdown is derived from the data, same as the old computed.
export const selectFaculties = createSelector(selectAllStudents, (students) =>
  [...new Set(students.map((student) => student.faculty))].sort(),
);

// The list the page actually shows. filter() already returns a new array,
// and the copy before sort() keeps that array from being edited in place.
export const selectVisibleStudents = createSelector(
  selectAllStudents,
  selectSearchText,
  selectSelectedFaculty,
  selectSortBy,
  (students, searchText, faculty, sortBy) => {
    const text = searchText.trim().toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(text) &&
        (faculty === 'all' || student.faculty === faculty),
    );

    return sortBy === 'name'
      ? [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      : [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id);
  },
);

// "08" style counter used by the tab label in the design.
export const selectTotalLabel = createSelector(selectAllStudents, (students) =>
  String(students.length).padStart(2, '0'),
);
