class FlightSchedule {
    private int id;
    private String flightDetails; //Reference to FlightDetails FK
    private String fromPlace;
    private String toPlace;
    private Date departureTime;
    private Date arrivalTime;
    private double price;
    private String day;
    private boolean nonVeg=false;
    private boolean veg=false;
    private int availableBusinessClassSeats;
    private int availableEconomyClassSeats;
    private boolean blocked=false;
}