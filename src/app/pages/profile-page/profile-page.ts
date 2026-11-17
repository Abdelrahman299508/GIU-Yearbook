/* =====================================================================
   FILE: pages/profile-page/profile-page.ts
   WHAT: The signed-in student's own story form.
   WHY:  The quote starts from the directory. A draft saved in the
         browser replaces that quote, and typing is not overwritten
         by the directory value afterwards.
   ===================================================================== */
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { StoryDraftService } from '../../services/story-draft.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly students = inject(StudentService);
  private readonly drafts = inject(StoryDraftService);

  private studentId: number | null = null;

  protected readonly form = new FormGroup({
    quote: new FormControl('', { nonNullable: true }),
    story: new FormControl('', { nonNullable: true }),
    moment: new FormControl('', { nonNullable: true }),
    next: new FormControl('', { nonNullable: true }),
    consent: new FormControl(false, { nonNullable: true }),
  });

  /** True after the student types, until a draft is saved. */
  protected readonly changed = signal(false);
  protected readonly statusText = signal('No changes yet');

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.changed.set(true);
      this.statusText.set('Unsaved changes');
    });

    const signedInId = this.auth.currentUser()?.studentId;
    this.students.getStudents().subscribe((list) => {
      const student = list.find((person) => person.id === signedInId);
      if (!student) {
        return;
      }
      this.studentId = student.id;

      const draft = this.drafts.load(student.id);
      if (draft) {
        this.form.patchValue(draft.values, { emitEvent: false });
      } else {
        this.form.patchValue({ quote: student.quote }, { emitEvent: false });
      }
      // The directory quote is applied only when there is no draft.
      // Writing it again here would wipe a restored draft.
      this.changed.set(false);
    });
  }

  protected onSave(): void {
    if (this.studentId == null) {
      return;
    }
    const savedAt = this.drafts.save(this.studentId, this.form.getRawValue());
    if (savedAt == null) {
      this.statusText.set('Could not save');
      return;
    }
    this.changed.set(false);
    this.statusText.set('Draft saved');
  }
}
