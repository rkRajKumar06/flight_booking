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
  airlinesList: FlightDetails[] = [];
  airlinesNames: Airlines[] = [];
  constructor(private utilService: UtilService) { 
    this.airlinesForm = new FormGroup({
      airlines: new FormControl("", Validators.required),
      flightNo: new FormControl("", Validators.required),
      noOfSeats: new FormControl("", Validators.required)
    });
  }

  ngOnInit(): void {
    this.getAllAirliles();
    this.getAirlineNamesList();
  }

  getAllAirliles(){
    this.utilService.getAirlines().subscribe((data:any)=>{
      this.airlinesList = data;
      //this.createAirlinesNamesList(this.airlinesList);
    });
  }

  getAirlineNamesList(){
    this.utilService.getAirlineList().subscribe((data:any)=>{
      this.airlinesNames = data;
    });
  }

  // createAirlinesNamesList(list: FlightDetails[]){
  //   this.airlinesNames = [];
  //   for(let i=0; i<list.length; i++){
  //     if(!this.airlinesNames.find(data => data.name === list[i].airlines)){
  //       let obj: Airlines = new Airlines();
  //       obj.name = list[i].airlines;
  //       obj.status = list[i].blocked==0;
  //       this.airlinesNames.push(obj);
  //     }
  //   }
  // }

  saveAirLine(name: string){
    let airlineObj: Airlines = new Airlines();
    airlineObj.name = name;
    this.utilService.addAirlineName(airlineObj).subscribe(()=>{
      this.getAirlineNamesList();
    })
  }

  addAirline(){
    let flightDetailsObj: FlightDetails = new FlightDetails();
    flightDetailsObj.airlines = this.airlinesForm.get('airlines')?.value;
    flightDetailsObj.flightNo = this.airlinesForm.get('flightNo')?.value;
    flightDetailsObj.noOfSeats = this.airlinesForm.get('noOfSeats')?.value;
    this.utilService.addAirlines(flightDetailsObj).subscribe((data)=>{
      this.getAllAirliles();
    });
  }

  updateAirlineStatus(obj: Airlines, isBlock: boolean){
    obj.status = !obj.status;
    this.utilService.updateAirlineName(obj).subscribe(()=>{
      this.getAirlineNamesList();
      this.blockOrEnableAirline(obj.name, isBlock);
    });
  }

  blockOrEnableAirline(airlineName: string, isBlock: boolean){
    this.utilService.getAirlineByName(airlineName).subscribe((data:any)=>{
      let dataArray: FlightDetails[] = data;
      for(let i=0; i<dataArray.length; i++){
        let obj = dataArray[i];
        obj.blocked = isBlock? 1 : 0;
        this.utilService.blockTheAirline(obj).subscribe(data => {
          this.getAllAirliles();
        });
      }
    });
  }

}
