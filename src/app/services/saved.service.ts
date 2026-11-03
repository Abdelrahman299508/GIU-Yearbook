/* =====================================================================
   FILE: src/app/services/saved.service.ts
   WHAT: The one shared list of students saved to "my yearbook".
   WHY:  The heart on a card and the Saved count in the header are
         different components. A root service is the smallest tool that
         lets both of them read and change the same list.
   ===================================================================== */
import { Injectable, computed, signal } from '@angular/core';

// providedIn: 'root' creates ONE copy for the whole app. Every component
// that asks for SavedService gets that same copy. This is what makes the
// state shared, and why it is still here after a page is destroyed.
@Injectable({ providedIn: 'root' })
export class SavedService {
  // Only this service can change the list.
  private readonly _ids = signal<number[]>([]);

  // Everybody else gets a read-only view. They can call ids() but they
  // cannot call set() or update() on it.
  readonly ids = this._ids.asReadonly();

  // Derived state: calculated from the list, never stored, so the count
  // cannot disagree with the hearts.
  readonly count = computed(() => this._ids().length);

  isSaved(id: number): boolean {
    return this._ids().includes(id);
  }

  toggle(id: number): void {
    // Build a NEW array. Signals notice a new value, not a changed array.
    // COMMON MISTAKE: this._ids().push(id) edits the old array in place,
    // so the screen never updates.
    this._ids.update((ids) =>
      ids.includes(id) ? ids.filter((savedId) => savedId !== id) : [...ids, id],
    );
  }
}
