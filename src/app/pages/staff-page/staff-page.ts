/* =====================================================================
   FILE: pages/staff-page/staff-page.ts
   WHAT: The Teachers & Staff page: hero, filters and inline cards.
   WHY:  This page loads its own list. Unlike Lab 1, the card markup
         lives here instead of in a separate component.

   WHAT THIS PAGE PRACTISES
   1. The same service pattern as the student directory
   2. Filtering and sorting with signals and computed
   3. A missing-image fallback without one signal per card
   ===================================================================== */
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { StaffMember } from '../../models/staff.model';
import { StaffService } from '../../services/staff.service';

// Shown when a portrait file is missing. Kept here so the path is not typed twice.
const PLACEHOLDER = 'images/placeholder-portrait.svg';

// Only these two sort options exist in the dropdown.
type SortMode = 'featured' | 'name';

@Component({
  selector: 'app-staff-page',
  templateUrl: './staff-page.html',
  styleUrl: './staff-page.css',
})
export class StaffPage implements OnInit {
  // The page asks the service for staff. It never reads the JSON file itself.
  private readonly staffService = inject(StaffService);

  protected readonly staff = signal<StaffMember[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly searchText = signal('');
  protected readonly selectedDepartment = signal('all');
  protected readonly sortBy = signal<SortMode>('featured');

  // The dropdown options come from the data, so a new department appears by itself.
  protected readonly departments = computed(() =>
    [...new Set(this.staff().map((m) => m.department))].sort(),
  );

  // The list on screen: filtered, then sorted. computed reruns only when
  // one of the signals it reads changes.
  protected readonly visibleStaff = computed(() => {
    const text = this.searchText().trim().toLowerCase();
    const dept = this.selectedDepartment();

    const filtered = this.staff().filter(
      (m) => m.name.toLowerCase().includes(text) && (dept === 'all' || m.department === dept),
    );

    return this.sortBy() === 'name'
      ? filtered.sort((a, b) => a.name.localeCompare(b.name))
      : filtered.sort((a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id);
  });

  ngOnInit(): void {
    this.staffService.getStaff().subscribe({
      next: (data) => {
        this.staff.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('We could not load the staff list. Please try again.');
        this.loading.set(false);
      },
    });
  }

  protected onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  protected onDepartmentChange(event: Event): void {
    this.selectedDepartment.set((event.target as HTMLSelectElement).value);
  }

  protected onSortChange(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value as SortMode);
  }

  // There is no card component, so there is no signal per portrait.
  // Swap the broken image directly. The check stops a loop if the
  // placeholder file is also missing.
  protected onPhotoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith(PLACEHOLDER)) {
      img.src = PLACEHOLDER;
    }
  }
}
