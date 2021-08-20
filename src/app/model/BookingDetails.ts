import { Passenger } from "./Passenger";

export class BookingDetails{
    id: number=0;
    pnr: string = "";
    //flightNo: number = 0;
    noOfPersons: number = 0;
    amount: number = 0;
    totalAmount: number = 0;
    departureDate: string = "";
    returnDate: string = "";
    //departure: string = "";
    //arrival: string = "";
    email: string = "";
    fromPlace: string = "";
    toPlace: string = "";
    cancelled: boolean=false;
    passengerList: Passenger[]=[];
    flightDetails1: number = 0;
    flightDetails2: number = 0;
    flightSchedule1: number = 0;
    flightSchedule2: number = 0;
    couponId: number = 0;
    seatClass: string = "";
    //schedule related fields
}