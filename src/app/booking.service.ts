import { Injectable } from '@angular/core';
import { FlightDetails } from './model/FlightDetails';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private flightDetailsList: FlightDetails[] = [];
  constructor(private utilService: UtilService) { 
    this.getFlightList();
  }

  getFlightList(){
    this.utilService.getFlightDetails().subscribe((data: any) => {
      this.flightDetailsList = data;
    });
  }

  getFlightName(id:number){
    let array: FlightDetails[] = [];
    if(this.flightDetailsList.length>0){
      array = this.flightDetailsList.filter(data => {return data.id == id});
    }
    return array.length>0? array[0].flightNo : "";
  }

}
