import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-lib';
import { debounceTime, delay, distinctUntilChanged, filter, map, Observable, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css']
})
export class FlightTypeaheadComponent {
  control = new FormControl();
  flights$: Observable<Flight[]> = this.getInitialStream();
  loading = false;

  constructor(private http: HttpClient) { }

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
      switchMap(city => this.load(city)),
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
}
