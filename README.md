# LHR Net
View the website in production [here](https//lhr.billyedmoore.com).

## About

Heathrow is the busiest airport in the UK, due to the airports location
noise is an issue. One step taken to mitigate this is a program of runway
rotation. One runway is used for departures for the first half of the day and
the other for arrivals then halfway through the day the runways are switched.

Additionally to reduce noise over densely populated West London Heathrow operates
with a Westerly preference, Easterly operations are used only when wind conditions
require it (~30% of flights).

Heathrow maintains a twitter account "Heathrow Runways" to update this information, 
however updates may be out of date (as updates are manually written) and the 
account is not updated 24/7. 

We look at the position of aircraft for a big rectangle centered on the airport and make a
prediction of which state the airport is operating in. This is run purely client side
in the browser using data fetched from the [open-sky network](https://opensky-network.org/).