import type { Config } from "./types";


interface ParsedOpenSkyResponse {
  timestamp: number,
  pixels: boolean[][]
}

interface OpenSkyStatesObject {
  time: number,
  states: OpenSkyStateVector[]
}

// If we were using these values the strings should be enums
// Since we only use lat and long its okay
type OpenSkyStateVector = [
  icao24: string,
  callsign: string | null,
  origin_country: string,
  time_position: number | null,
  last_contact: number,
  longitude: number | null,
  latitude: number | null,
  baro_altitude: number | null,
  on_ground: boolean,
  velocity: number | null,
  true_track: number | null,
  vertical_rate: number | null,
  sensors: number[] | null,
  geo_altitude: number | null,
  squawk: string | null,
  spi: boolean,
  position_source: number,
  category: number
];

export async function fetchStateFromOpenSky(config: Config) {
  const center_lat = config.HeathrowLat;
  const center_long = config.HeathrowLong;

  const lat_min = center_lat - config["latOffset"];
  const lat_max = center_lat + config["latOffset"];
  const long_min = center_long - config["longOffset"];
  const long_max = center_long + config["longOffset"];

  const base_url = "https://opensky-network.org/api/states/all?";
  const response = await fetch(`${base_url}lamin=${lat_min}&lamax=${lat_max}&lomin=${long_min}&lomax=${long_max}`)

  if (!response.ok) {
    throw new Error(`${response.status} Request to Open Sky Failed, ${response.statusText}.`)
  }

  const statesObject: OpenSkyStatesObject = await response.json()
  const { timestamp, pixels } = parseOpenSkyResponse(config, statesObject)

  return { timestamp, pixels }

}

function parseOpenSkyResponse(config: Config, response_json: OpenSkyStatesObject): ParsedOpenSkyResponse {
  const timestamp = response_json.time

  const pixels: boolean[][] = Array.from({ length: config.yLength }, () =>
    Array.from({ length: config.xLength }, () => false)
  );
  const lat_min = config.HeathrowLat - config.latOffset;
  const long_min = config.HeathrowLong - config.longOffset;

  const x_bin_size = (config["longOffset"] * 2) / config["xLength"];
  const y_bin_size = (config["latOffset"] * 2) / config["yLength"];

  if (response_json.states == null) {
    return { timestamp, pixels }
  }
  for (let i in response_json.states) {
    const long = response_json.states[i][5]
    const lat = response_json.states[i][6]

    // If no lat or no long ignore plane
    if (lat === null || long === null) {
      console.log(`Skipped ${response_json.states[1]}, no lat and/or no long`)
      continue
    }

    const offset_lat = lat - lat_min
    const offset_long = long - long_min

    let x = Math.trunc(offset_long / x_bin_size)
    let y = Math.trunc(offset_lat / y_bin_size)

    if ((x >= 0 && x < config["xLength"]) &&
      (y >= 0 && y < config["yLength"])) {
      pixels[y][x] = true
    } else {
      console.log(`Failed to get(${x}, ${y})`)
    }
  }
  return { timestamp, pixels }
}
