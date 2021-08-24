import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../booking.service';
import { BookingDetails } from '../model/BookingDetails';
import { Coupons } from '../model/Coupons';
import { FlightDetails } from '../model/FlightDetails';
import { Passenger } from '../model/Passenger';
import { Schedule } from '../model/Schedule';
import { User } from '../model/User';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  id1: number = 0;
  id2: number = 0;
  pasenger: number = 0;
  discountPercentage: number = 0;
  scheduleDetailList1: Schedule[] = [];
  scheduleDetailList2: Schedule[] = [];
  couponsList: Coupons[] = [];
  totalAmount: number = 0;
  email: string = "";
  finalPrice: number = 0;
  percentageDetection: number = 0;
  passengerList: Passenger[] = [];
  passengerObj: Passenger = new Passenger();
  ticketClass: string = "";
  enableSubmitButton: boolean = false;
  //private allFlightsList: FlightDetails[] = [];

  constructor(private utilService: UtilService, private router: Router,private routes: ActivatedRoute, private bookService: BookingService) { 
    this.routes.params.subscribe((pathVariable)=>{
      console.log(pathVariable);
      this.id1 = pathVariable.id1;
      this.id2 = pathVariable.id2;
      this.pasenger = pathVariable.passenger;
      console.log("test id 1-"+this.id1+" test id2-"+this.id2+" passenger "+this.pasenger);
      this.getScheduleById();
      this.getActiveCoupons();
      this.checkRequiredPassengerAddition();
    });
    let classType = localStorage.getItem("classType");
    this.ticketClass = classType!==null? classType : "";
    console.log(" Classtype "+localStorage.getItem("classType"));
    let value = sessionStorage.getItem("loggedInUser");
    console.log(" session "+sessionStorage.getItem("loggedInUser"));
    if(value!==null && value!==""){
      let user: User = JSON.parse(value);
      this.email = user.email;
    }
  }

  getActiveCoupons(){
    this.utilService.getAllActiveCoupons().subscribe((data:any)=>{
      this.couponsList = data;
    });
  }

  calculateTotalPrice(){
    let noOfPersons = this.pasenger;
    if(noOfPersons>0 && this.scheduleDetailList1.length > 0){
      console.log(" price "+this.scheduleDetailList1[0].price);
      let fare: number = +this.scheduleDetailList1[0].price;
      console.log(" fare 1 "+fare);
      if(this.scheduleDetailList2.length>0){
        fare = fare + (+this.scheduleDetailList2[0].price);
        console.log(" fare 2 "+fare);
      } 
      this.totalAmount = fare*noOfPersons;
      console.log(" fare 3 "+this.totalAmount);
    }
    this.finalPrice = this.totalAmount;
  }

  calculateDiscountedPrice(id: number){
    console.log(" test cha "+id);
    this.discountPercentage = id;
    if(id>0){
      let obj: Coupons = new Coupons();
    this.couponsList.forEach(data=>{
      if(data.id === id){
        obj = data;
        console.log(" coupons det "+obj.percentage);
      this.percentageDetection = obj.percentage;
      this.finalPrice = this.totalAmount - ((this.totalAmount/100)*this.percentageDetection);
      }
    });
    
    }
  }

  // getAllFlightDetails(){
  //   this.utilService.getFlightDetails().subscribe((data:any) => {
  //     this.allFlightsList = data;
  //   });
  // }

  getFlightName(id: number){
    return this.bookService.getFlightName(id);
  }

  ngOnInit(): void {
    // get schedule details for DISPLAY==> flight name, price of the ticket, no of seats, email
    // input no of persons, total price of the ticket, 
    //this.getAllFlightDetails();
  }

  getScheduleById(){
    if(this.id1>0){
      this.utilService.getScheduleById(this.id1).subscribe((data:any)=>{
        this.scheduleDetailList1.push(data);
        this.calculateTotalPrice();
      });
    } 
    if(this.id2>0){
      this.utilService.getScheduleById(this.id2).subscribe((data:any)=>{
        this.scheduleDetailList2.push(data);
        this.calculateTotalPrice();
      });
    }
  }

  bookTicket(){
    let value = sessionStorage.getItem("loggedInUser");
    let bookingDetails: BookingDetails = new BookingDetails();
    bookingDetails.pnr = "PNR"+this.randomString(5);
    bookingDetails.fromPlace = this.scheduleDetailList1[0].fromPlace;
    bookingDetails.toPlace = this.scheduleDetailList1[0].toPlace;
    bookingDetails.flightDetails1 = this.scheduleDetailList1[0].flightDetails;
    bookingDetails.flightSchedule1 = this.scheduleDetailList1[0].id;
    if(this.scheduleDetailList2.length>0){
      bookingDetails.flightDetails2 = this.scheduleDetailList2[0].flightDetails;
      bookingDetails.flightSchedule2 = this.scheduleDetailList2[0].id;
    }
    
    bookingDetails.amount = this.totalAmount;
    bookingDetails.totalAmount = this.finalPrice;
    //bookingDetails.noOfPersons = this.passengerList.length;
    bookingDetails.cancelled = false;
    let departuredate = localStorage.getItem("departureDate");
    bookingDetails.departureDate = departuredate!==null? departuredate : "";
    let returnDate = localStorage.getItem("returnDate");
    bookingDetails.returnDate = returnDate!==null? returnDate : "";
    bookingDetails.seatClass = this.ticketClass;
    if(value!==null && value!==""){
      let user: User = JSON.parse(value);
      bookingDetails.email = user.email;
    }
    bookingDetails.noOfPersons = +this.pasenger;
    bookingDetails.passengerList = this.passengerList;
    this.utilService.saveBooking(bookingDetails).subscribe(()=>{
      localStorage.removeItem("departureDate");
      localStorage.removeItem("returnDate");
      localStorage.removeItem("classType");
      this.router.navigate(['/', 'manageBooking']);
      // add kafka to REDUCE the no of available tickets in SCHEDULE
    }, err => {
      console.log(" Error "+err)
    })
    
  }

  cancel(){
    localStorage.removeItem("departureDate");
    localStorage.removeItem("returnDate");
    localStorage.removeItem("classType");
    this.router.navigate(['/', 'search']);
  }

  randomString(length: number) {
    let chars: string = "123456789123456789";
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

  addPassenger(){
    console.log(" list length "+this.passengerList.length);
    if(this.passengerList.length==0 || this.passengerList.length<this.pasenger){
      this.passengerList.push(this.passengerObj);
      this.passengerObj = new Passenger();
      //this.calculateTotalPrice();
      //this.calculateDiscountedPrice(this.discountPercentage);
      this.checkRequiredPassengerAddition();
    }
  }

  checkRequiredFieldPresent(): boolean{
    if(this.passengerObj.name.length>0 && this.passengerObj.age>0 && this.passengerObj.mealType.length >0){
      return false;
    }
    return true;
  }

  checkRequiredPassengerAddition(){
    console.log(" array lenght "+this.passengerList.length+"  pasenger "+this.pasenger);
    if(this.passengerList.length == this.pasenger){
      this.enableSubmitButton = true;
    }else{
      this.enableSubmitButton = false;
    }
    console.log(" test index "+this.enableSubmitButton);
  }

  removePassenger(index: number){
    console.log(" start lenght "+this.passengerList.length);
    this.passengerList.splice(index, 1);
    console.log(" end lenght "+this.passengerList.length);
    this.checkRequiredPassengerAddition();
  }

}
