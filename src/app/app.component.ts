import { Component } from '@angular/core';
import { UtilService } from './util.service';

export const PLACES: string[] = [
  "Delhi",
  "Mumbai",
  "Kolkata",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Cochin"
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FLIGHT BOOKING';
  isLoggedIn: boolean = false;
  constructor(private utilService: UtilService){
    this.isLoggedIn = utilService.getLoggedInUser().role!=""? true : false;
  }

  logout(){
    this.utilService.logout();
  }
}
