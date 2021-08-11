import { Passenger } from "./Passenger";

export class BookingDetails{
    id: number=0;
    pnr: string = "";
    flightNo: string = "";
    noOfPersons: number = 0;
    amount: number = 0;
    departure: string = "";
    arrival: string = "";
    email: string = "";
    fromPlace: string = "";
    toPlace: string = "";
    active: number=0;
    passengerList: Passenger[]=[];
    //schedule related fields
}