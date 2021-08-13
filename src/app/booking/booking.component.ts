import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDetails } from '../model/BookingDetails';
import { Coupons } from '../model/Coupons';
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
  scheduleDetailList1: Schedule[] = [];
  scheduleDetailList2: Schedule[] = [];
  couponsList: Coupons[] = [];
  totalAmount: number = 0;
  noOfSeats: number = 0;
  email: string = "";
  finalPrice: number = 0;
  percentageDetection: number = 0;
  passengerList: Passenger[] = [];
  passengerObj: Passenger = new Passenger();

  constructor(private utilService: UtilService, private router: Router,private routes: ActivatedRoute) { 
    this.routes.params.subscribe((pathVariable)=>{
      console.log(pathVariable);
      this.id1 = pathVariable.id1;
      this.id2 = pathVariable.id2;
      console.log("test id 1-"+this.id1+" test id2-"+this.id2);
      this.getScheduleById();
      this.getActiveCoupons();
    });
    let value = sessionStorage.getItem("loggedInUser");
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
    console.log(" cal t price "+this.passengerList.length);
    
    let noOfPersons = this.passengerList.length;
    if(noOfPersons>0){
      console.log(" price "+this.scheduleDetailList1[0].price);
      let fare: number = +this.scheduleDetailList1[0].price;
      if(this.scheduleDetailList2.length>0){
        fare = fare + (+this.scheduleDetailList2[0].price);
      } 
      this.totalAmount = fare*noOfPersons;
    }
    this.finalPrice = this.totalAmount;
  }

  calculateDiscountedPrice(id: number){
    console.log(" test cha "+id);
    if(id>0){
      let obj: Coupons = new Coupons();
    this.couponsList.forEach(data=>{
      if(data.id === id){
        obj = data;
      }
    });
    console.log(" coupons det "+obj.percentage);
    this.percentageDetection = obj.percentage;
    this.finalPrice = this.totalAmount - ((this.totalAmount/100)*this.percentageDetection);
    }
  }

  ngOnInit(): void {
    // get schedule details for DISPLAY==> flight name, price of the ticket, no of seats, email
    // input no of persons, total price of the ticket, 
  }

  getScheduleById(){
    if(this.id1>0){
      this.utilService.getScheduleById(this.id1).subscribe((data:any)=>{
        this.scheduleDetailList1.push(data);
      });
    } 
    if(this.id2>0){
      this.utilService.getScheduleById(this.id2).subscribe((data:any)=>{
        this.scheduleDetailList2.push(data);
      });
    }
  }

  bookTicket(){
    let value = sessionStorage.getItem("loggedInUser");
    let bookingDetails: BookingDetails = new BookingDetails();
    bookingDetails.pnr = "PNR"+this.randomString(5);
    bookingDetails.fromPlace = this.scheduleDetailList1[0].fromPlace;
    bookingDetails.toPlace = this.scheduleDetailList1[0].toPlace;
    bookingDetails.flightNo = this.scheduleDetailList1[0].flightNo;
    bookingDetails.departure = this.scheduleDetailList1[0].departure;
    bookingDetails.arrival = this.scheduleDetailList1[0].arrival;
    bookingDetails.amount = this.finalPrice;
    bookingDetails.noOfPersons = this.passengerList.length;
    bookingDetails.active = 1;
    let departuredate = localStorage.getItem("departureDate");
    bookingDetails.departureDate = departuredate!==null? departuredate : "";
    let returnDate = localStorage.getItem("returnDate");
    bookingDetails.returnDate = returnDate!==null? returnDate : "";
    if(value!==null && value!==""){
      let user: User = JSON.parse(value);
      bookingDetails.email = user.email;
    }
    bookingDetails.noOfPersons = +this.noOfSeats;
    bookingDetails.passengerList = this.passengerList;
    this.utilService.saveBooking(bookingDetails).subscribe(()=>{
      localStorage.removeItem("departureDate");
      localStorage.removeItem("returnDate");
      this.router.navigate(['/', 'manageBooking']);
    })
    //sucessful saving redirect to manage ticket/booking
    
  }

  cancel(){
    localStorage.removeItem("departureDate");
    localStorage.removeItem("returnDate");
    this.router.navigate(['/', 'search']);
  }

  randomString(length: number) {
    let chars: string = "123456789123456789";
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

  addPassenger(){
    this.passengerList.push(this.passengerObj);
    this.passengerObj = new Passenger();
    this.calculateTotalPrice();
    this.calculateDiscountedPrice(0);
  }

  checkRequiredFieldPresent(): boolean{
    if(this.passengerObj.name.length>0 && this.passengerObj.age>0 && this.passengerObj.mealType.length >0){
      return false;
    }
    return true;
  }

  removePassenger(index: number){
    console.log(" start lenght "+this.passengerList.length);
    console.log(" indxt "+index);
    this.passengerList.splice(index, 1);
    console.log(" end lenght "+this.passengerList.length);
  }

}
