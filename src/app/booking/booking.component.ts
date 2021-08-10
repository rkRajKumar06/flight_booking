import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDetails } from '../model/BookingDetails';
import { Coupons } from '../model/Coupons';
import { Schedule } from '../model/Schedule';
import { User } from '../model/User';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  id: number = 0;
  scheduleDetailList1: Schedule[] = [];
  couponsList: Coupons[] = [];
  totalAmount: number = 0;
  noOfSeats: number = 0;
  email: string = "";
  username: string = "";
  finalPrice: number = 0;
  percentageDetection: number = 0;

  constructor(private utilService: UtilService, private router: Router,private routes: ActivatedRoute) { 
    this.routes.params.subscribe((pathVariable)=>{
      console.log(pathVariable);
      this.id = pathVariable.id1;
      console.log("test id"+this.id);
      this.getScheduleById();
      this.getActiveCoupons();
    });
    let value = sessionStorage.getItem("loggedInUser");
    if(value!==null && value!==""){
      let user: User = JSON.parse(value);
      this.email = user.email;
      this.username = user.name;
    }
  }

  getActiveCoupons(){
    this.utilService.getAllActiveCoupons().subscribe((data:any)=>{
      this.couponsList = data;
    });
  }

  calculateTotalPrice(id: number){
    console.log(" cal t price ");
    let noOfPersons = id;
    if(noOfPersons>0){
      console.log(" price "+this.scheduleDetailList1[0].price);
      let fare: number = +this.scheduleDetailList1[0].price;
      this.totalAmount = fare*noOfPersons;
    }
  }

  calculatePrice(id: number){
    console.log(" test cha "+id);
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

  ngOnInit(): void {
    // get schedule details for DISPLAY==> flight name, price of the ticket, no of seats, email
    // input no of persons, total price of the ticket, 
  }

  getScheduleById(){
    if(this.id>0){
      this.utilService.getScheduleById(this.id).subscribe((data:any)=>{
        this.scheduleDetailList1.push(data);
      });
    }
  }

  bookTicket(){
    let value = sessionStorage.getItem("loggedInUser");
    let bookingDetails: BookingDetails = new BookingDetails();
    bookingDetails.pnr = "PNR78955";
    bookingDetails.fromPlace = this.scheduleDetailList1[0].fromPlace;
    bookingDetails.toPlace = this.scheduleDetailList1[0].toPlace;
    bookingDetails.flightNo = this.scheduleDetailList1[0].flightNo;
    bookingDetails.departure = this.scheduleDetailList1[0].departure;
    bookingDetails.arrival = this.scheduleDetailList1[0].arrival;
    bookingDetails.active = 1;
    if(value!==null && value!==""){
      let user: User = JSON.parse(value);
      bookingDetails.email = user.email;
    }
    bookingDetails.noOfPersons = +this.noOfSeats;
    this.utilService.saveBooking(bookingDetails).subscribe(()=>{
      this.router.navigate(['/', 'manageBooking']);
    })
    //sucessful saving redirect to manage ticket/booking
    
  }

}
