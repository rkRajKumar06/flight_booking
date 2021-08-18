import { Component, OnInit } from '@angular/core';
import { BookingDetails } from '../model/BookingDetails';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss']
})
export class BookingHistoryComponent implements OnInit {

  bookingDetails: BookingDetails[]=[];
  constructor(private utilService: UtilService) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(){
    this.utilService.getBookingDetailsForHistory(this.utilService.getLoggedInUser().email).subscribe((data:any) => {
      this.bookingDetails = data;
    });
  }

 
}
