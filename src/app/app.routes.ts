import { Routes } from '@angular/router';
import { CustomersComponent } from './components/customers/customers.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';

export const routes: Routes = [
  {
    path: 'start',
    loadComponent: () =>
      import('./start/start.component').then((mod) => mod.StartComponent),
  },
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'customer' , component : CustomersComponent},
  {path : 'edit', component : EditCustomerComponent}
];
