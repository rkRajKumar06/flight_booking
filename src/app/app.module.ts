import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AirlineComponent } from './airline/airline.component';
import { FlightScheduleComponent } from './flight-schedule/flight-schedule.component';
import { BookingComponent } from './booking/booking.component';
import { ManageCouponsComponent } from './manage-coupons/manage-coupons.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ManageBookingComponent,
    BookingHistoryComponent,
    LoginComponent,
    HeaderComponent,
    AirlineComponent,
    FlightScheduleComponent,
    BookingComponent,
    ManageCouponsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
