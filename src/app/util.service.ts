import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './model/User';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import {map} from 'rxjs/operators';
import { BookingDetails } from './model/BookingDetails';
import { FlightDetails } from './model/FlightDetails';
import { Schedule } from './model/Schedule';
import { Coupons } from './model/Coupons';
import { Airlines } from './model/Airlines';
import jwt_decode from 'jwt-decode';

export const TOKEN = 'token'
export const AUTHENTICATED_USER = 'authenticaterUser'

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public loggedInUser: User=new User();
  constructor(private router: Router, private http: HttpClient) { }

  private url: string = "http://localhost:3000/";

  private backendUrl: string = "http://localhost:8989/api";

  //private backendUrl: string = "http://18.220.121.31:8989/api";
  

  public getAuthorizationHeader(){
    let token=sessionStorage.getItem(TOKEN);
    console.log(" token "+token);
    const httpOptions = {
      headers: new HttpHeaders({
        token: ""+token
      })
    };
    return httpOptions;
  }

  // public login(username: string, password: string){
  //   let result: boolean = false;
  //   return this.http.get(this.url+"user?name="+username+"&password="+password);
  // }

  executeJWTAuthenticationService(username: string, password: string) {
    
    return this.http.post<any>(
      this.backendUrl+`/user/authenticate`,{
        username,
        password
      }).pipe(
        map(
          data => {
            sessionStorage.setItem(AUTHENTICATED_USER, username);
            sessionStorage.setItem(TOKEN, `Bearer ${data.token}`);
            var decoded: JSON = jwt_decode(data.token);
            let user: User = new User();
            user = jwt_decode(data.token);
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));


            console.log(" decoded jwt--"+JSON.stringify(decoded));
            console.log(" decoded jwt role--"+user.name);
            console.log(" decoded jwt role--"+user.role);
            console.log(" decoded jwt role--"+user.email);
            // sessionStorage.setItem("role", data.role);
            // sessionStorage.setItem("email", data.email);
            console.log(" test token "+data.token);
            return data;
          }
        )
      );
  }

  register(user: User) {
    user.role = "user";
    return this.http.post(this.backendUrl+"/user/register", user);
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

  // searchFlights(fromPlace: string, toPlace: string, noOfPassemgers: number){
  //   return this.http.get(this.url+"schedule?fromPlace="+fromPlace+"&toPlace="+toPlace+"&isblocked=false");
  // }

  searchFlights(fromPlace: string, toPlace: string, noOfPassemgers: number, departureDate: string, classType: string){
    console.log(" test console "+departureDate);
    return this.http.get(this.backendUrl+"/admin/schedule/search?fromPlace="+fromPlace+"&toPlace="+toPlace+"&departureDate="+departureDate+"&seatClass="+classType+"&noOfPassengers="+noOfPassemgers);
  }

  // getAllActiveBooking(email: string){
  //   return this.http.get(this.url+"bookingDetails?email="+email+"&active=1");
  // }

  getAllActiveBooking(email: string){
    return this.http.get(this.backendUrl+"/user/bookingDetails/manage/"+email, this.getAuthorizationHeader());
  }

  // getAllBooking(email: string){
  //   return this.http.get(this.url+"bookingDetails?email="+email);
  // }

  getBookingDetailsForHistory(email: string){
    return this.http.get(this.backendUrl+"/user/bookingDetails/history/"+email, this.getAuthorizationHeader());
  }

  getBookingDetails(id: number){
    return this.http.get(this.backendUrl+"/user/bookingDetails/"+id, this.getAuthorizationHeader());
  }

  cancelBooking(booking: BookingDetails){
    return this.http.put(this.backendUrl+"/user/bookingDetails/cancel/"+booking.id, booking, this.getAuthorizationHeader());
  }

  addAirlineName(airline: Airlines){
    return this.http.post(this.backendUrl+"/admin/airlines", airline);
  }

  updateAirlineName(airline: Airlines){
    return this.http.put(this.backendUrl+"/admin/airlines/"+airline.id, airline);
  }

  getAirlineList(){
    return this.http.get(this.backendUrl+"/admin/airlines");
  }

  addFlightDetails(airline: FlightDetails){
    return this.http.post(this.backendUrl+"/admin/flightDetails", airline);
  }

  // blockTheAirline(airline: FlightDetails){
  //   return this.http.put(this.url+"/admin/flightDetails/"+airline.id, airline);
  // }

  getFlightDetails(){
    return this.http.get(this.backendUrl+"/admin/flightDetails");
  }

  getFlightDetailsById(id: number){
    return this.http.get(this.backendUrl+"/admin/flightDetails/"+id);
  }

  getFlightDetailsBasedOnAirlinesId(id: number){
    return this.http.get(this.backendUrl+"/admin/flightDetails/list/"+id);
  }

  // getAirlineByName(name: string){
  //   return this.http.get(this.url+"flightDetails?airlines="+name);
  // }

  

  addSchedule(schedule: Schedule){
    return this.http.post(this.backendUrl+"/admin/schedule", schedule);
  }

  updateSchedule(schedule: Schedule){
    return this.http.put(this.backendUrl+"/admin/schedule/"+schedule.id, schedule);
  }

  // deleteSchedule(id: number){
  //   return this.http.delete(this.url+"schedule/"+id);
  // }

  getSchedule(){
    return this.http.get(this.backendUrl+"/admin/schedule");
  }

  // getScheduleById(id: number){
  //   return this.http.get(this.url+"schedule/"+id);
  // }

  getScheduleById(id: number){
    return this.http.get(this.backendUrl+"/admin/schedule/"+id);
  }

  saveBooking(obj: BookingDetails){
    return this.http.post(this.backendUrl+"/user/bookingDetails", obj, this.getAuthorizationHeader());
  }

  getAllCoupons(){
    return this.http.get(this.backendUrl+"/admin/coupons");
  }

  // getAllActiveCoupons(){
  //   return this.http.get(this.url+"coupons?status=true");
  // }

  getAllActiveCoupons(){
    return this.http.get(this.backendUrl+"/admin/coupons/active");
  }

  saveCoupon(obj: Coupons){
    return this.http.post(this.backendUrl+"/admin/coupons", obj);
  }

  updateCoupon(obj: Coupons){
    return this.http.put(this.backendUrl+"/admin/coupons/"+obj.id, obj);
  }

  logout(){
    sessionStorage.setItem("loggedInUser", "");
    sessionStorage.setItem(AUTHENTICATED_USER, "");
    sessionStorage.setItem(TOKEN, "");
    // sessionStorage.setItem("role", "");
    // sessionStorage.setItem("email", "");
    this.router.navigate(['login']);
  }

  getAuthenticatedUser() {
    return sessionStorage.getItem(AUTHENTICATED_USER);
  }

  getAuthenticatedToken() {
    if(this.getAuthenticatedUser()){
      return sessionStorage.getItem(TOKEN);
    }
    return;
  }

}
