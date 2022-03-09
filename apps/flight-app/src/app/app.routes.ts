import { ExtraOptions, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { BasketComponent } from './basket/basket.component';
import { HomeComponent } from './home/home.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'flight-booking',
    loadChildren: () => import('./flight-booking/flight-booking.module')
      .then(esm => esm.FlightBookingModule)
  },
  {
    path: 'mf-passenger',
    loadChildren: () => loadRemoteModule<any>({
      type: 'module',
      remoteEntry: 'http://localhost:3000/remoteEntry.js',
      exposedModule: './module'
    }).then(esm => esm['PassengerModule'])
  },
  {
    path: 'basket',
    component: BasketComponent,
    outlet: 'aux'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
