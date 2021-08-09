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
  flightsList: string[] = [];
  private editId: number=0;
  constructor(private utilService: UtilService) {
    this.scheduleForm = new FormGroup({
      airlineName:  new FormControl('', Validators.required),
      flightNo: new FormControl('', Validators.required),
      fromPlace: new FormControl('', Validators.required),
      toPlace: new FormControl('', Validators.required),
      day: new FormControl('', Validators.required),
      departure: new FormControl('', Validators.required),
      arrival: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required)
    });
  }

  saveSchedule(){
    let obj: Schedule = new Schedule();
    obj = this.scheduleForm.value;
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
  }

  getAllSchedule(){
    this.utilService.getSchedule().subscribe((data:any)=>{
      this.scheduleList = data;
    });
  }

  getAllAirlines(){
    this.utilService.getAirlines().subscribe((data:any) => {
      let array: FlightDetails[] = data;
      array.forEach(data=>{
        if(data.blocked==0){
        let airline: Airlines = new Airlines();
        airline.name = data.airlines;
        airline.status = data.blocked==0;
        this.airlines.push(airline);
      }
      })
    });
  }

  getFlightsbasedOnAirlines(airlineName: string){
    this.utilService.getAirlineByName(airlineName).subscribe((data:any)=>{
      let array: FlightDetails[] = data;
      array.forEach(data=>{
        if(data.blocked==0){
          this.flightsList.push(data.flightNo);
        }
      });
    });
  }

  enableEditOption(obj: Schedule){
    this.editId = obj.id;
    this.getFlightsbasedOnAirlines(obj.airlineName);
    this.scheduleForm.setValue({
      airlineName: obj.airlineName,
      flightNo: obj.flightNo,
      fromPlace: obj.fromPlace,
      toPlace: obj.toPlace,
      day: obj.day,
      departure: obj.departure,
      arrival: obj.arrival,
      price: obj.price
    });
  }

  updateSchedule(){
    let obj: Schedule = new Schedule();
    obj = this.scheduleForm.value;
    this.utilService.updateSchedule(obj).subscribe(data=>{
      this.getAllSchedule();
      this.scheduleForm.reset();
    });
  }

  delete(id: number){
    this.utilService.deleteSchedule(id).subscribe(data=>{
      this.getAllSchedule();
    });
  }

}
