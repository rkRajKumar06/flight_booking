import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AirlineComponent } from './airline/airline.component';
import { AppComponent } from './app.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { FlightScheduleComponent } from './flight-schedule/flight-schedule.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { SearchComponent } from './search/search.component';
import { UserGuard } from './user.guard';

const routes: Routes = [
  {path:"", redirectTo: "login", pathMatch:"full"},
  {path:"search", component: SearchComponent, canActivate:[UserGuard]},
  {path:"manageBooking", component: ManageBookingComponent, canActivate:[UserGuard]},
  {path:"bookingHistory", component: BookingHistoryComponent, canActivate:[UserGuard]},
  {path:"header", component: HeaderComponent},
  {path:"login", component: LoginComponent},
  {path:"airline", component: AirlineComponent, canActivate:[AdminGuard]},
  {path:"manageSchedule", component: FlightScheduleComponent, canActivate:[AdminGuard]},
  {path:"**", redirectTo: "login", pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
