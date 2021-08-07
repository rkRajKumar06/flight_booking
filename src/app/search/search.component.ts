import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private utilservice: UtilService) {
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
    console.log("Test - 1 value "+JSON.stringify(this.searchForm.value));
    if(this.searchForm.valid){
      this.utilservice.searchFlights(this.searchForm.get('fromPlace')?.value,this.searchForm.get('toPlace')?.value,this.searchForm.get('departureDate')?.value).subscribe(
        (data: any) => {
          console.log("search list-"+data);
          this.oneWayList = data;
          this.roundList = data;
        }
      );
    }
  }
}
