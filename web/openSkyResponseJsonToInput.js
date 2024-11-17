function openSkyResponseJsonToInput(config, response) {
	timestamp = response["time"];

	pixels = Array.from({ length: config["yLength"] }, () => Array.from({ length: config["xLength"] }, () => 0)
	);
	lat_min = config["HeathrowLat"] - config["latOffset"];
	long_min = config["HeathrowLong"] - config["longOffset"];

	x_bin_size = (config["longOffset"] * 2) / config["xLength"];
	y_bin_size = (config["latOffset"] * 2) / config["yLength"];

	if (response["states"] == null) {
		return [timestamp, pixels];
	}
	for (i in response["states"]) {
		long = response["states"][i][5];
		lat = response["states"][i][6];

		offset_lat = lat - lat_min;
		offset_long = long - long_min;

		x = Math.trunc(offset_long / x_bin_size);
		y = Math.trunc(offset_lat / y_bin_size);

		if ((x >= 0 && x < config["xLength"]) &&
			(y >= 0 && y < config["yLength"])) {
			pixels[y][x] = 1;
		} else {
			console.log(`Failed to get (${x}, ${y})`);
		}
	}
	return [timestamp, pixels];
}

