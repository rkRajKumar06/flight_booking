import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Airlines } from '../model/Airlines';
import { FlightDetails } from '../model/FlightDetails';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-airline',
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.scss']
})
export class AirlineComponent implements OnInit {

  airlinesForm: FormGroup;
  flightDetailsList: FlightDetails[] = [];
  airlinesNames: Airlines[] = [];
  constructor(private utilService: UtilService) { 
    this.airlinesForm = new FormGroup({
      airlines: new FormControl("", Validators.required),
      flightNo: new FormControl("", Validators.required),
      businessClassSeats: new FormControl("", Validators.required),
      economyClassSeats: new FormControl("", Validators.required)
    });
  }

  ngOnInit(): void {
    this.getAllFlightDetails();
    this.getAirlineNamesList();
  }

  getAllFlightDetails(){
    this.utilService.getFlightDetails().subscribe((data:any)=>{
      this.flightDetailsList = data;
    });
  }

  getAirlineNamesList(){
    this.utilService.getAirlineList().subscribe((data:any)=>{
      this.airlinesNames = data;
    });
  }

  getAirlineName(id: number){
    if(this.airlinesNames.length>0){
      return this.airlinesNames.filter(data => {return data.id == id})[0].name;
    }
    return "";
  }
//saveAirLine(name: string){
  saveAirLine(obj: HTMLInputElement){
    console.log(obj.value);
    let airlineObj: Airlines = new Airlines();
    airlineObj.name = obj.value;
    this.utilService.addAirlineName(airlineObj).subscribe(()=>{
      this.getAirlineNamesList();
    })
    obj.value = "";
  }

  addFlightDetails(){
    let flightDetailsObj: FlightDetails = new FlightDetails();
    //console.log(" airline obj "+JSON.stringify(this.airlinesForm.get('airlines')?.value));
    flightDetailsObj.airlines = this.airlinesForm.get('airlines')?.value;
    flightDetailsObj.flightNo = this.airlinesForm.get('flightNo')?.value;
    flightDetailsObj.businessClassSeats = this.airlinesForm.get('businessClassSeats')?.value;
    flightDetailsObj.economyClassSeats = this.airlinesForm.get('economyClassSeats')?.value;
    this.utilService.addFlightDetails(flightDetailsObj).subscribe((data)=>{
      this.getAllFlightDetails();
      this.airlinesForm.reset();
    });
  }

  updateAirlineStatus(obj: Airlines, isBlock: boolean){
    obj.blocked = !obj.blocked;
    this.utilService.updateAirlineName(obj).subscribe(()=>{
      this.getAirlineNamesList();
      this.getAllFlightDetails();
      //this.blockOrEnableAirline(obj.name, isBlock);
    });
  }

  // blockOrEnableAirline(airlineName: string, isBlock: boolean){
  //   this.utilService.getAirlineByName(airlineName).subscribe((data:any)=>{
  //     let dataArray: FlightDetails[] = data;
  //     for(let i=0; i<dataArray.length; i++){
  //       let obj = dataArray[i];
  //       obj.blocked = isBlock;
  //       this.utilService.blockTheAirline(obj).subscribe(data => {
  //         this.getAllFlightDetails();
  //       });
  //     }
  //   });
  // }

}
