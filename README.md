# LHR Net
View the website in production [here](https://lhr.billyedmoore.com).

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

## Usage

### Running the existing model

To run the model on live data without set up you can check out the 
[website](https://lhr.billyedmoore.com) (see the code for this in the /web directory 
or in the browser as it isn't minified).

Alternatively the model is available (/web/model.onnx) in Onnx format. The model takes as input a
```config[xLength] x config[yLength]``` matrix of 0s and 1s where 0 represents the 
absence of a plane and 1 the presence of at least one plane. The distance from the 
center point (+-```config[latOffset]``` and +-```config[longOffset]```) and the center 
point itself (```config[HeathrowLat]``` and ```config[HeathrowLong]```) are specified 
in the config file ```config.json```.

### Train the model yourself

To train your own model you can run ```python fetch_raw_states.py``` for a few days (if 
you are a researcher with access to the open sky historic dataset then you could do this
instantly and would have access to a bigger training set) this will make an api request
for our target area every ~5mins and save the result.

Then you can create a known_states file by default located at ```/data/known_states.json``` 
(can be altered in ```config.json```). For the time the fetch script was running you should fill a
timeline of states, this should take the form of a list of objects each in the form:
```json
{
 "start": "2024-12-12T07:00:00+00:00", // ISO 8601 end time
 "end":   "2024-12-12T15:00:00+00:00", // ISO 8601 end time
 "value": 1 // the index of the state in config[states]
}
```

You can then run ```python process_states.py``` this will create two new 
files ```data\test_details.csv``` and ```data\train_details.csv```. Each containing a list
of run length encoded inputs followed by the index in ```config[states]``` of the corresponding state. 
For example a snippet of "Night" states looks like:

```
992f1t245f1t809f,3
109f1t134f1t311f1t434f1t81f1t974f,3
183f1t372f1t1491f,3
985f1t6f1t10f1t1044f,3
933f1t176f1t937f,3
```

If you then run ```notebook.ipynb``` it will produce ```model.keras``` and ```model.onnx```. You will
also be able to see how the model is performing, like any machine learning problem more data is 
generally better for performance so the longer you can run the fetch script the better. 