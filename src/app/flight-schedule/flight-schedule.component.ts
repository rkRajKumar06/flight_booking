import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PLACES } from '../app.component';
import { Airlines } from '../model/Airlines';
import { FlightDetails } from '../model/FlightDetails';
import { Schedule } from '../model/Schedule';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-flight-schedule',
  templateUrl: './flight-schedule.component.html',
  styleUrls: ['./flight-schedule.component.scss']
})
export class FlightScheduleComponent implements OnInit {

  places: string[] = PLACES;
  scheduleList: Schedule[] = [];
  scheduleForm: FormGroup;
  airlines: Airlines[] = [];
  allAirlines: Airlines[] = [];
  flightsList: FlightDetails[] = [];
  private allFlightsList: FlightDetails[] = [];
  private editId: number=0;
  constructor(private utilService: UtilService) {
    this.scheduleForm = new FormGroup({
      airlineId:  new FormControl('', Validators.required),
      flightDetails: new FormControl('', Validators.required),
      fromPlace: new FormControl('', Validators.required),
      toPlace: new FormControl('', Validators.required),
      day: new FormControl('', Validators.required),
      departureTime: new FormControl('', Validators.required),
      arrivalTime: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required)
    });
  }

  saveSchedule(){
    let obj: Schedule = new Schedule();
    obj = this.scheduleForm.value;
    let flightObj = this.flightsList.filter((value) => {return value.id == obj.flightDetails})[0];
    obj.availableBusinessClassSeats = flightObj.businessClassSeats;
    obj.availableEconomyClassSeats = flightObj.economyClassSeats;
    obj.airlineId = flightObj.airlines;
    console.log(" edit id-"+this.editId);
    if(this.editId>0){
      obj.id = this.editId;
      this.updateSchedule();
    }else{
      this.utilService.addSchedule(obj).subscribe(data=>{
        this.getAllSchedule();
        this.scheduleForm.reset();
      });
    }
    this.editId = 0;
  }

  ngOnInit(): void {
    this.getAllSchedule();
    this.getAllAirlines();
    this.getAllFlightDetails();
  }

  getAllSchedule(){
    this.utilService.getSchedule().subscribe((data:any)=>{
      this.scheduleList = data;
    });
  }

  getAllAirlines(){
    this.utilService.getAirlineList().subscribe((data:any) => {
      this.airlines = data;
      this.allAirlines = data;
      this.airlines = this.airlines.filter((value) =>{ return value.blocked == false});
    });
  }

  getAllFlightDetails(){
    this.utilService.getFlightDetails().subscribe((data:any) => {
      this.allFlightsList = data;
    });
  }

  getFlightName(id:number){
    if(this.allFlightsList.length>0){
      return this.allFlightsList.filter(data => {return data.id == id})[0].flightNo;
    }
    return "";
  }

  getAirlineName(id: number){
    if(this.allAirlines.length>0){
       let array = this.allAirlines.filter(data => {return data.id == id});
       return array.length>0? array[0].name : "";
    }
    return "";
  }

  // getAllAirlines(){
  //   this.utilService.getAirlines().subscribe((data:any) => {
  //     let array: FlightDetails[] = data;
  //     array.forEach(data=>{
  //       if(data.blocked==0){
  //       let airline: Airlines = new Airlines();
  //       airline.name = data.airlines;
  //       airline.status = data.blocked==0;
  //       this.airlines.push(airline);
  //     }
  //     })
  //   });
  // }

  getFlightsbasedOnAirlines(id: number){
    this.utilService.getFlightDetailsBasedOnAirlinesId(id).subscribe((data:any)=>{
      this.flightsList = data;
      this.flightsList = this.flightsList.filter(data => {return !data.blocked});
      // array.forEach(data=>{
      //   this.flightsList.push(data.flightNo);
      // });
    });
  }

  enableEditOption(obj: Schedule){
    this.editId = obj.id;
    
    console.log(" print edit id "+obj.id);
    this.utilService.getFlightDetailsById(obj.flightDetails).subscribe((data:any)=>{
      let flightObj: FlightDetails = data;
      this.getFlightsbasedOnAirlines(flightObj.airlines);
      console.log(" in side get "+flightObj.airlines);
      this.scheduleForm.setValue({
        airlineId: flightObj.airlines,
        flightDetails: obj.flightDetails,
        fromPlace: obj.fromPlace,
        toPlace: obj.toPlace,
        day: obj.day,
        departureTime: obj.departureTime,
        arrivalTime: obj.arrivalTime,
        price: obj.price
      });
    });
  }

  updateSchedule(){
    let obj: Schedule = new Schedule();
    obj = this.scheduleForm.value;
    obj.id = this.editId;
    this.utilService.updateSchedule(obj).subscribe(data=>{
      this.getAllSchedule();
      this.scheduleForm.reset();
    });
  }

  // delete(id: number){
  //   this.utilService.deleteSchedule(id).subscribe(data=>{
  //     this.getAllSchedule();
  //   });
  // }

}