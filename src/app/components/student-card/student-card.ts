/* =====================================================================
   FILE: components/student-card/student-card.ts
   WHAT: One clickable student card for the Class of 2028 directory.
   WHY:  The students page already loads and filters students. This
         component only draws one card from the student it is given.
         The saved list is not owned here: the card asks SavedService.
   ===================================================================== */
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Student } from '../../models/student.model';
import { SavedService } from '../../services/saved.service';

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

  // The shared service. The card does not own the saved list; it only asks.
  private readonly saved = inject(SavedService);

  // Did the portrait fail to load?
  private readonly imageFailed = signal(false);

  // The path actually shown: placeholder if the real image failed.
  // computed recalculates when imageFailed or student changes.
  protected readonly photoSrc = computed(() =>
    this.imageFailed() ? 'images/placeholder-portrait.svg' : this.student().photo,
  );

  // Is THIS student saved? computed() re-runs when the service's list changes.
  protected readonly isSaved = computed(() => this.saved.isSaved(this.student().id));

  // Called by the template when the image cannot be loaded.
  protected onImageError(): void {
    this.imageFailed.set(true);
  }

  protected onToggleSaved(event: Event): void {
    // The whole card is a link. Without these two lines, a click on the
    // heart would ALSO open the student's profile.
    event.preventDefault();
    event.stopPropagation();
    this.saved.toggle(this.student().id);
  }
}
