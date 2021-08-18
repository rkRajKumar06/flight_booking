import { Airlines } from "./Airlines";

export class FlightDetails{
    id: number = 0;
    airlines: number = 0;
    flightNo: string = "";
    businessClassSeats: number = 0;
    economyClassSeats: number = 0;
    blocked: boolean=false;
}