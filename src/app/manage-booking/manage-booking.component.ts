import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingDetails } from '../model/BookingDetails';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss']
})
export class ManageBookingComponent implements OnInit {

  bookingDetails: BookingDetails[]=[];
  constructor(private utilService: UtilService,private router: Router) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(){
    console.log("on load-"+this.utilService.getLoggedInUser().email);
    this.utilService.getAllActiveBooking(this.utilService.getLoggedInUser().email).subscribe((data:any) => {
      this.bookingDetails = data;
    });
  }

  cancelBooking(obj: BookingDetails){
    obj.active = 0;
    this.utilService.cancelBooking(obj).subscribe(date=>{
      this.findAll();
    });
  }

  viewDetails(obj: BookingDetails){
    this.router.navigate(['/viewBookingDetails/'+obj.id])
  }

}
