import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { Student } from '../models/student.model';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let http: HttpTestingController;

  const fakeStudents: Student[] = [
    {
      id: 1,
      name: 'Maya Hassan',
      faculty: 'Engineering',
      classYear: 2026,
      quote: 'Build things.',
      photo: 'maya.jpg',
      featured: true,
    },
    {
      id: 2,
      name: 'Adam Schneider',
      faculty: 'Informatics',
      classYear: 2026,
      quote: 'Curiosity first.',
      photo: 'adam.jpg',
      featured: false,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StudentService);
    http = TestBed.inject(HttpTestingController);
    vi.useFakeTimers(); // Control delay(400) manually
  });

  afterEach(() => {
    http.verify(); // Fails if unexpected HTTP calls were made
    vi.useRealTimers();
  });

  it('GETs the students file and returns what the server sent', async () => {
    // Observables do nothing until subscribed; firstValueFrom subscribes for us.
    const result = firstValueFrom(service.getStudents());

    const req = http.expectOne('mock-api/students.json');
    expect(req.request.method).toBe('GET');

    req.flush(fakeStudents); // Play the server
    await vi.advanceTimersByTimeAsync(400); // Move the clock forward 400ms

    expect(await result).toEqual(fakeStudents);
  });

  it('passes a server error on to the caller', async () => {
    let failure: unknown;
    service.getStudents().subscribe({ error: (err) => (failure = err) });

    http
      .expectOne('mock-api/students.json')
      .flush('Boom', { status: 500, statusText: 'Server Error' });
    await vi.advanceTimersByTimeAsync(400);

    expect((failure as { status: number }).status).toBe(500);
  });
});
