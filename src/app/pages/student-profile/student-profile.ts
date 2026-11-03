/* =====================================================================
   FILE: pages/student-profile/student-profile.ts
   WHAT: One student's story, opened from a card.
   WHY:  Leaving the directory destroys that page. This page reads the
         same store, so the list does not have to be fetched again, and
         the filters are still set when the reader goes back.
   ===================================================================== */
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { SavedService } from '../../services/saved.service';
import { loadStudents } from '../../state/students/students.actions';
import {
  selectErrorMessage,
  selectLoaded,
  selectLoading,
  selectStudentEntities,
} from '../../state/students/students.selectors';

const PLACEHOLDER = 'images/placeholder-portrait.svg';

@Component({
  selector: 'app-student-profile',
  imports: [RouterLink],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css',
})
export class StudentProfilePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly saved = inject(SavedService);

  // /students/3 -> 3. toSignal keeps the id updated if the route changes.
  private readonly studentId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    { initialValue: Number(this.route.snapshot.paramMap.get('id')) },
  );

  private readonly entities = this.store.selectSignal(selectStudentEntities);
  private readonly imageFailed = signal(false);

  protected readonly loading = this.store.selectSignal(selectLoading);
  protected readonly loaded = this.store.selectSignal(selectLoaded);
  protected readonly errorMessage = this.store.selectSignal(selectErrorMessage);

  // entities is a dictionary: one lookup instead of scanning the list.
  protected readonly student = computed(() => this.entities()[this.studentId()]);

  protected readonly photoSrc = computed(() => {
    const student = this.student();
    if (!student || this.imageFailed()) {
      return PLACEHOLDER;
    }
    return student.photo;
  });

  protected readonly isSaved = computed(() => this.saved.isSaved(this.studentId()));

  ngOnInit(): void {
    // Safe to call every time. A list that is already loaded is left as it is.
    this.store.dispatch(loadStudents());
  }

  protected onImageError(): void {
    this.imageFailed.set(true);
  }

  protected onToggleSaved(): void {
    this.saved.toggle(this.studentId());
  }
}
