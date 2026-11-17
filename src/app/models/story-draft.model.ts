/* =====================================================================
   FILE: src/app/models/story-draft.model.ts
   WHAT: The fields of one saved story draft.
   ===================================================================== */

export interface StoryDraft {
  quote: string;
  story: string;
  moment: string;
  next: string;
  consent: boolean;
}
