/* =====================================================================
   FILE: src/app/models/staff.model.ts
   WHAT: An INTERFACE describing the shape of one staff member.
   WHY:  staff.service.ts imports StaffMember. Without this file the
         app cannot compile, even though Lab 1 only builds the student
         card. The fields match public/mock-api/staff.json.
   ===================================================================== */

export interface StaffMember {
  id: number;
  name: string;
  department: string;
  role: string;
  bio: string;
  quote: string;
  /** Path to the portrait, relative to the /public folder. */
  photo: string;
  featured: boolean;
}
