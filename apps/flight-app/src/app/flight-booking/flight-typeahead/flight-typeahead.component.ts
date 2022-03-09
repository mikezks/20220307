import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-lib';
import { catchError, debounceTime, delay, distinctUntilChanged, filter, map, Observable, of, Subscription, switchMap, tap, timer } from 'rxjs';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css']
})
export class FlightTypeaheadComponent implements OnDestroy {
  control = new FormControl();
  flights$: Observable<Flight[]> = this.getInitialStream();
  loading = false;
  subscription = new Subscription();

  constructor(private http: HttpClient) {
    this.subscription.add(
      timer(0, 1_000).subscribe(console.log)
    );
  }

  getInitialStream(): Observable<Flight[]> {
    /**
     * Stream 1: Input value changes
     * - Trigger
     * - Data Provider
     */
    return this.control.valueChanges.pipe(
      // Filtering START
      filter(city => city.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
      // Filtering END
      // Side-effect
      tap(() => this.loading = true),
      /**
       * Stream 2: Backend API call -> Flight array
       * - Data Provider
       */
      switchMap(city => this.load(city).pipe(
        catchError(() => of([]))
      )),
      // delay(1000),
      // Side-effect
      tap(() => this.loading = false),
      // Transformation
      map(flights => flights)
    );
  }

  load(from: string): Observable<Flight[]> {
    const url = "http://www.angular.at/api/flight";

    const params = new HttpParams()
                        .set('from', from);

    const headers = new HttpHeaders()
                        .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, {params, headers});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
