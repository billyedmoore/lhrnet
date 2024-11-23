window.onload = getState

function getState() {
	fetch("./config_link.json")
		.then((response) => response.json())
		.then(fetchStateFromOpenSky);
}

function handleErrorsAndGetJson(response) {
	if (!response.ok) {
		displayError(response)
		throw new Error("Request to OpenSky failed.")
	}
	return response.json()
}

function fetchStateFromOpenSky(config) {
	center_lat = config["HeathrowLat"];
	center_long = config["HeathrowLong"];

	lat_min = center_lat - config["latOffset"];
	lat_max = center_lat + config["latOffset"];
	long_min = center_long - config["longOffset"];
	long_max = center_long + config["longOffset"];

	base_url = "https://opensky-network.org/api/states/all?";
	fetch(`${base_url}lamin=${lat_min}&lamax=${lat_max}&lomin=${long_min}&lomax=${long_max}`)
		.then(handleErrorsAndGetJson)
		.then((json) => openSkyJsonToInput(config, json))
		.then((return_val) => {
			arr = return_val[1]
			make_inference(arr).then(
				(vals) => {
					result_data = vals[0];
					elem = vals[1];
					var t = document.getElementById("result-target");
					t.innerHTML = "" // Clear existing children
					t.appendChild(elem)
					console.log(result_data)
				}
			)

			run_model(arr)
			var t = document.getElementById("image-target");
			t.innerHTML = "" // Clear existing_children

			var zero_colour = [10, 10, 10, 255]
			var one_colour = [250, 250, 250, 255]

			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				temp = zero_colour
				zero_colour = one_colour
				one_colour = temp
			}
			img_multiplier = Math.floor((window.innerWidth / arr[0].length) * 0.8)
			create_canvas_from_pixels(t, arr, img_multiplier, one_colour = one_colour, zero_colour = zero_colour)
			return [return_val[0], arr]
		}).then((return_val) => console.log(return_val[0]))
		.catch((err) => console.log(err));
}


function openSkyJsonToInput(config, response_json) {
	timestamp = response_json["time"]

	pixels = Array.from({ length: config["yLength"] }, () =>
		Array.from({ length: config["xLength"] }, () => 0)
	);
	lat_min = config["HeathrowLat"] - config["latOffset"];
	long_min = config["HeathrowLong"] - config["longOffset"];

	x_bin_size = (config["longOffset"] * 2) / config["xLength"];
	y_bin_size = (config["latOffset"] * 2) / config["yLength"];

	if (response_json["states"] == null) {
		return [timestamp, pixels]
	}
	for (i in response_json["states"]) {
		long = response_json["states"][i][5]
		lat = response_json["states"][i][6]

		offset_lat = lat - lat_min
		offset_long = long - long_min

		x = Math.trunc(offset_long / x_bin_size)
		y = Math.trunc(offset_lat / y_bin_size)

		if ((x >= 0 && x < config["xLength"]) &&
			(y >= 0 && y < config["yLength"])) {
			pixels[y][x] = 1
		} else {
			console.log(`Failed to get(${x}, ${y})`)
		}
	}
	return [timestamp, pixels]
}


function displayError(response) {
	codes = { "429": " too many requests (the daily rate limit has been hit)" };
	var t = document.getElementById("error-target");
	var dv = document.createElement("div");
	dv.className = "err";

	innerhtml = `<p>Open sky network returned HTTP status \"${response.status}\"`;
	if (response.status in codes) {
		innerhtml += `${codes[response.status]}`
	}
	innerhtml += "</p>"
	dv.innerHTML = innerhtml
	t.appendChild(dv)
}
