/* =====================================================================
   FILE: components/student-card/student-card.ts
   WHAT: One clickable student card for the Class of 2028 directory.
   WHY:  The students page already loads and filters students. This
         component only draws one card from the student it is given.
   ===================================================================== */
import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-card',
  // RouterLink lets the whole card navigate without reloading the page.
  imports: [RouterLink],
  templateUrl: './student-card.html',
  styleUrl: './student-card.css',
})
export class StudentCard {
  // The parent page hands us one student. required means the page
  // cannot forget to pass it.
  readonly student = input.required<Student>();

  // Did the portrait fail to load?
  private readonly imageFailed = signal(false);

  // The path actually shown: placeholder if the real image failed.
  // computed recalculates when imageFailed or student changes.
  protected readonly photoSrc = computed(() =>
    this.imageFailed() ? 'images/placeholder-portrait.svg' : this.student().photo,
  );

  // Called by the template when the image cannot be loaded.
  protected onImageError(): void {
    this.imageFailed.set(true);
  }
}
