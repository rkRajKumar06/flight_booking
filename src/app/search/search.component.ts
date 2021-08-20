import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PLACES } from '../app.component';
import { BookingService } from '../booking.service';
import { Airlines } from '../model/Airlines';
import { Schedule } from '../model/Schedule';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  places: string[] = PLACES;
  tripType: string = "oneway";
  searchForm: FormGroup;
  oneWayList: Schedule[] = [];
  roundList: Schedule[] = [];
  displayTable: boolean = false;
  schedule1: number = 0;
  schedule2: number = 0;
  style: string = "lightblue";
  noOfPassenger: number = 0;
  airlines: Airlines[] = [];

  constructor(private utilservice: UtilService, private router: Router, private bookingService: BookingService) {
    this.searchForm = new FormGroup({
      tripType: new FormControl("", Validators.required),
      fromPlace: new FormControl("", Validators.required),
      toPlace: new FormControl("", Validators.required),
      departureDate: new FormControl("", Validators.required),
      returnDate: new FormControl("", Validators.required),
      noOfPassenger: new FormControl("", Validators.required),
      classType: new FormControl("", Validators.required)
    });
    bookingService.getFlightList();
  }

  ngOnInit(): void {
    this.getAllAirlines();
  }

  getAllAirlines(){
    this.utilservice.getAirlineList().subscribe((data:any) => {
      this.airlines = data;
    });
  }

  getAirlineName(id: number){
    if(this.airlines.length>0 && id!==0){
      return this.airlines.filter(data => {return data.id == id})[0].name;
    }
    return "";
  }
  // searchFlights(){
  //   console.log("Test - 1"+this.searchForm.valid);
  //   this.tripType = this.searchForm.get('tripType')?.value;
  //   console.log(" type "+this.tripType);
  //   if(this.searchForm.valid){
  //     this.utilservice.searchFlights(this.searchForm.get('fromPlace')?.value,this.searchForm.get('toPlace')?.value, this.searchForm.get('noOfPassenger')?.value).subscribe(
  //       (data: any) => {
  //         console.log("search list-"+data);
  //         this.oneWayList = data;
  //         this.displayTable = true;
  //       }
  //     );
  //     if(this.tripType==="round"){
  //       this.utilservice.searchFlights(this.searchForm.get('toPlace')?.value,this.searchForm.get('fromPlace')?.value, this.searchForm.get('noOfPassenger')?.value).subscribe(
  //         (data: any) => {
  //           console.log("search list-"+data);
  //           this.roundList = data;
  //         }
  //       );
  //     }
  //   }
  // }

  searchFlights(){
    console.log("Test - 1"+this.searchForm.valid);
    this.tripType = this.searchForm.get('tripType')?.value;
    this.noOfPassenger = this.searchForm.get('noOfPassenger')?.value;
    console.log(" type "+this.tripType);
    if(this.searchForm.valid){
      this.utilservice.searchFlights(this.searchForm.get('fromPlace')?.value,this.searchForm.get('toPlace')?.value, this.searchForm.get('noOfPassenger')?.value, this.searchForm.get('departureDate')?.value, this.searchForm.get('classType')?.value).subscribe(
        (data: any) => {
          console.log("search list-"+data);
          this.oneWayList = data;
          this.displayTable = true;
        }
      );
      if(this.tripType==="round"){
        this.utilservice.searchFlights(this.searchForm.get('toPlace')?.value,this.searchForm.get('fromPlace')?.value, this.searchForm.get('noOfPassenger')?.value, this.searchForm.get('returnDate')?.value, this.searchForm.get('classType')?.value).subscribe(
          (data: any) => {
            console.log("search list-"+data);
            this.roundList = data;
          }
        );
      }
    }
  }

  getFlightName(id: number){
    console.log("  test flight id ------- "+id);
    return this.bookingService.getFlightName(id);
  }

  resetReturnDate(tripType: string){
    if(tripType === 'oneway'){
      this.searchForm.controls['returnDate'].setValue("");
      this.searchForm.controls['returnDate'].disable();
      this.searchForm.get("returnDate")?.clearAsyncValidators();
    }else{
      this.searchForm.get("returnDate")?.setValidators([Validators.required]);
      this.searchForm.controls['returnDate'].enable();
    }
  }

  selectRowIdForTable1(id: number){
    console.log(" row click "+id);
    this.schedule1 = id;
  }

  selectRowIdForTable2(id: number){
    this.schedule2 = id;
  }

  bookTicket(){
    console.log(this.schedule1);
    this.router.navigate(['/ticketBooking/'+this.schedule1, {id2: this.schedule2, passenger: this.noOfPassenger}]);
    localStorage.setItem("departureDate", this.searchForm.get('departureDate')?.value);
    localStorage.setItem("returnDate", this.searchForm.get('returnDate')?.value);
    localStorage.setItem("classType", this.searchForm.get('classType')?.value);
  }

  cancelBookingSelection(){
    this.schedule1 = 0;
    this.schedule2 = 0;
  }

  resetSearch(){
    this.searchForm.reset();
    this.oneWayList = [];
    this.roundList = [];
    this.tripType = "";
  }

  getType(){
    return this.tripType;
  }
}
