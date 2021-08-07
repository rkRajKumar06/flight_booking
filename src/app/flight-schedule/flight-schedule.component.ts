import { Component, OnInit } from '@angular/core';
import { PLACES } from '../app.component';

@Component({
  selector: 'app-flight-schedule',
  templateUrl: './flight-schedule.component.html',
  styleUrls: ['./flight-schedule.component.scss']
})
export class FlightScheduleComponent implements OnInit {

  places: string[] = PLACES;

  constructor() { }

  ngOnInit(): void {
  }

}
