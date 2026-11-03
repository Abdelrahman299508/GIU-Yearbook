/* =====================================================================
   FILE: pages/students-page/students-page.ts
   WHAT: The landing page: title, filters and the grid of student cards.
   FIGMA: Frame "Class of 2028 · Student directory".

   WHAT STUDENTS PRACTISE HERE
   1. Reading a list, its loading state and its filters from an NgRx store
   2. Dispatching actions instead of editing the data in the page
   3. selectSignal: the template still calls signals, the store owns them

   The page used to keep this state in its own signals. Opening a profile
   destroyed the page, so the search was forgotten. The store is created
   once for the app, so the list and the filters are still here on return.
   ===================================================================== */
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { StudentCard } from '../../components/student-card/student-card';
import {
  SortMode,
  loadStudents,
  setFaculty,
  setSearchText,
  setSort,
} from '../../state/students/students.actions';
import {
  selectAllStudents,
  selectErrorMessage,
  selectFaculties,
  selectLoading,
  selectSearchText,
  selectSelectedFaculty,
  selectSortBy,
  selectTotalLabel,
  selectVisibleStudents,
} from '../../state/students/students.selectors';

@Component({
  selector: 'app-student-page',
  // A standalone component must list every component it uses.
  imports: [StudentCard],
  templateUrl: './students-page.html',
  styleUrl: './students-page.css',
})
export class StudentsPage implements OnInit {
  // The page talks to the store. StudentService is used by the effect,
  // not by this component.
  private readonly store = inject(Store);

  // selectSignal turns a selector into a signal. The template still
  // calls these with (), and they update when the store changes.
  protected readonly students = this.store.selectSignal(selectAllStudents);
  protected readonly loading = this.store.selectSignal(selectLoading);
  protected readonly errorMessage = this.store.selectSignal(selectErrorMessage);
  protected readonly searchText = this.store.selectSignal(selectSearchText);
  protected readonly selectedFaculty = this.store.selectSignal(selectSelectedFaculty);
  protected readonly sortBy = this.store.selectSignal(selectSortBy);
  protected readonly faculties = this.store.selectSignal(selectFaculties);
  protected readonly visibleStudents = this.store.selectSignal(selectVisibleStudents);
  protected readonly totalLabel = this.store.selectSignal(selectTotalLabel);

  // ngOnInit runs ONCE, right after Angular creates the component.
  // If the list was already loaded, the reducer and the effect do nothing.
  ngOnInit(): void {
    this.store.dispatch(loadStudents());
  }

  // Event handlers report what the user did. The reducer writes the state.
  protected onSearch(event: Event): void {
    this.store.dispatch(setSearchText({ searchText: (event.target as HTMLInputElement).value }));
  }

  protected onFacultyChange(event: Event): void {
    this.store.dispatch(setFaculty({ faculty: (event.target as HTMLSelectElement).value }));
  }

  protected onSortChange(event: Event): void {
    this.store.dispatch(setSort({ sortBy: (event.target as HTMLSelectElement).value as SortMode }));
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
