import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';

import * as FlightBookingActions from './flight-booking.actions';
import { FlightService } from '@flight-workspace/flight-lib';



@Injectable()
export class FlightBookingEffects {

  loadFlights$ = createEffect(() =>
    /**
     * Stream 1: dispatched Actions
     * - Trigger
     * - Data Provider
     */
    this.actions$.pipe(
      // Filtering
      ofType(FlightBookingActions.flightsLoad),
      /**
       * Stream 2: Backend API call -> Flight array
       */
      switchMap(action => this.flightService.find(
        action.from,
        action.to,
        action.urgent
      )),
      // Transformation
      map(flights => FlightBookingActions.flightsLoaded({ flights }))
    )
  );

  constructor(
    private actions$: Actions,
    private flightService: FlightService) {}
}
