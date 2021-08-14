class BookingDetails{
    private int id;
    private String pnr;
    private String flightDetails1; //Reference to FlightDetails 1 for oneway trip
    private String flightDetails2; //Reference to FlightDetails 1 for round trip
    private int noOfPersons;
    private double amount;  // to store with out discount
    private double totalAmount;
    private Date departureDate;
    private Date arrivalDate;
    private String email;
    private String fromPlace;
    private String toPlace;
    private String passengers;  // Reference to Passengers List FK
    private boolean camcelled=false;
}