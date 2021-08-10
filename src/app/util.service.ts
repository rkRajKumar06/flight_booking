import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './model/User';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { BookingDetails } from './model/BookingDetails';
import { FlightDetails } from './model/FlightDetails';
import { Schedule } from './model/Schedule';
import { Coupons } from './model/Coupons';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public loggedInUser: User=new User();
  constructor(private router: Router, private http: HttpClient) { }

  private url: string = "http://localhost:3000/";

  public login(username: string, password: string){
    let result: boolean = false;
    return this.http.get(this.url+"user?name="+username+"&password="+password);
  }

  register(user: User) {
    user.role = "user";
    return this.http.post(this.url+"user", user);
  }

  getLoggedInUser(): User{
    let value = sessionStorage.getItem("loggedInUser");
    if(value!==null && value!==""){
      let user: User = JSON.parse(value);
      this.loggedInUser = user;
      return user;
    }else{
      return new User();
    }
  }

  searchFlights(...args:string[]){
    return this.http.get(this.url+"schedule?fromPlace="+args[0]+"&toPlace="+args[1]);
  }

  getAllActiveBooking(email: string){
    return this.http.get(this.url+"bookingDetails?email="+email+"&active=1");
  }

  getAllBooking(email: string){
    return this.http.get(this.url+"bookingDetails?email="+email);
  }

  cancelBooking(booking: BookingDetails){
    return this.http.put(this.url+"bookingDetails/"+booking.id, booking);
  }

  addAirlines(airline: FlightDetails){
    return this.http.post(this.url+"flightDetails", airline);
  }

  blockTheAirline(airline: FlightDetails){
    return this.http.put(this.url+"flightDetails/"+airline.id, airline);
  }

  getAirlineByName(name: string){
    return this.http.get(this.url+"flightDetails?airlines="+name);
  }

  getAirlines(){
    return this.http.get(this.url+"flightDetails");
  }

  addSchedule(schedule: Schedule){
    return this.http.post(this.url+"schedule", schedule);
  }

  updateSchedule(schedule: Schedule){
    return this.http.put(this.url+"schedule/"+schedule.id, schedule);
  }

  deleteSchedule(id: number){
    return this.http.delete(this.url+"schedule/"+id);
  }

  getSchedule(){
    return this.http.get(this.url+"schedule");
  }

  getScheduleById(id: number){
    return this.http.get(this.url+"schedule/"+id);
  }

  saveBooking(obj: BookingDetails){
    return this.http.post(this.url+"bookingDetails", obj);
  }

  getAllCoupons(){
    return this.http.get(this.url+"coupons");
  }

  getAllActiveCoupons(){
    return this.http.get(this.url+"coupons?status=true");
  }

  saveCoupon(obj: Coupons){
    return this.http.post(this.url+"coupons", obj);
  }

  updateCoupon(obj: Coupons){
    return this.http.put(this.url+"coupons/"+obj.id, obj);
  }

  logout(){
    sessionStorage.setItem("loggedInUser", "");
    this.router.navigate(['login']);
  }

}
