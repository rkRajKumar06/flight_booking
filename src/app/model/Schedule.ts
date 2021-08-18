export class Schedule{
    id: number=0;
    flightDetails: number = 0;
    airlineId: number = 0;
    fromPlace: string = "";
    toPlace: string = "";
    departureTime: string = "";
    arrivalTime: string = "";
    price: number = 0;
    day: string = "";
    nonVeg: boolean = true;
    veg: boolean = true;
    availableBusinessClassSeats: number = 0;
    availableEconomyClassSeats: number = 0;
    blocked: boolean = false;
}