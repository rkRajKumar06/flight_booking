import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {path:"home", component: AppComponent},
  {path:"search", component: SearchComponent},
  {path:"manageBooking", component: ManageBookingComponent},
  {path:"bookingHistory", component: BookingHistoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
