import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../booking.service';
import { BookingDetails } from '../model/BookingDetails';
import { UtilService } from '../util.service';


@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.scss']
})
export class ViewBookingComponent implements OnInit {

  viewObj: BookingDetails = new BookingDetails();
  constructor(private utilservice: UtilService, private routes: ActivatedRoute, private bookService: BookingService) {
    this.routes.params.subscribe((pathvariables)=>{
      let num: number = pathvariables.id;
      this.getBookingDetails(num);
    });
   }

  ngOnInit(): void {
  }

  getFlightName(id: number){
    return this.bookService.getFlightName(id);
  }

  getBookingDetails(id: number){
    this.utilservice.getBookingDetails(id).subscribe((data:any)=>{
      this.viewObj = data;
    });
  }

  openPDF():void {
    const printContent = document.getElementById("bookingDetailsSection");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    if(WindowPrt!==null && printContent!==null){
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
      WindowPrt.close();    
    }
  }



}
