/* =====================================================================
   FILE: src/app/services/story-draft.service.ts
   WHAT: Saves a student's unfinished story in the browser.
   WHY:  A draft should survive a refresh, and a broken or full
         localStorage must not crash the profile page.
   ===================================================================== */
import { Injectable } from '@angular/core';

import { StoryDraft } from '../models/story-draft.model';

export interface StoredDraft {
  savedAt: string;
  values: StoryDraft;
}

@Injectable({ providedIn: 'root' })
export class StoryDraftService {
  private key(studentId: number): string {
    return `giu:story-draft:${studentId}`;
  }

  load(studentId: number): StoredDraft | null {
    const raw = localStorage.getItem(this.key(studentId));
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as StoredDraft;
      if (!parsed?.values) {
        return null;
      }
      return parsed;
    } catch {
      // Damaged text is treated as "no draft", not as a crash.
      return null;
    }
  }

  /** The time the draft was stored, or null when the browser refuses to store it. */
  save(studentId: number, values: StoryDraft): string | null {
    const savedAt = new Date().toISOString();
    try {
      localStorage.setItem(this.key(studentId), JSON.stringify({ savedAt, values }));
      return savedAt;
    } catch {
      return null;
    }
  }

  clear(studentId: number): void {
    localStorage.removeItem(this.key(studentId));
  }
}
