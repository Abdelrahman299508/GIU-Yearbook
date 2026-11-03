/* =====================================================================
   FILE: src/app/app.config.ts
   WHAT: Registers the "global tools" the whole app can use.
   ===================================================================== */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import { StudentsEffects } from './state/students/students.effects';
import { studentsFeatureKey, studentsReducer } from './state/students/students.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // STEP 1: Turn on routing (which URL shows which page).
    provideRouter(routes),
    // STEP 2: Turn on HttpClient. Our StudentService needs it to read
    // the fake API now and talk to Laravel later.
    // COMMON MISTAKE: skipping this line gives "No provider for HttpClient".
    provideHttpClient(),

    // STEP 3: The students store. It outlives every page, so the list,
    // the loading flag and the filters are still there after a profile.
    provideStore({ [studentsFeatureKey]: studentsReducer }),
    provideEffects(StudentsEffects),

    provideClientHydration(),
  ],
};
