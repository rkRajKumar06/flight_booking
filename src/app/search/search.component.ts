import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PLACES } from '../app.component';
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

  constructor(private utilservice: UtilService, private router: Router) {
    this.searchForm = new FormGroup({
      tripType: new FormControl("", Validators.required),
      fromPlace: new FormControl("", Validators.required),
      toPlace: new FormControl("", Validators.required),
      departureDate: new FormControl("", Validators.required),
      returnDate: new FormControl("")
    });
  }

  ngOnInit(): void {
  }

  searchFlights(){
    console.log("Test - 1"+this.searchForm.valid);
    this.tripType = this.searchForm.get('tripType')?.value;
    console.log(" type "+this.tripType);
    if(this.searchForm.valid){
      this.utilservice.searchFlights(this.searchForm.get('fromPlace')?.value,this.searchForm.get('toPlace')?.value).subscribe(
        (data: any) => {
          console.log("search list-"+data);
          this.oneWayList = data;
          this.roundList = data;
          this.displayTable = true;
        }
      );
    }
  }

  resetReturnDate(tripType: string){
    if(tripType === 'oneway'){
      this.searchForm.controls['returnDate'].setValue("");
      this.searchForm.controls['returnDate'].disable();
    }else{
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
    this.router.navigate(['/ticketBooking/'+this.schedule1]);
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
