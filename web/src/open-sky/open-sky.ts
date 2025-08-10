import type { Config } from "../types";

import type { OpenSkyStatesResponse, OpenSkyStates, OpenSkyStateObject, OpenSkyStateVector, StatesPreparedForPrediction } from "./types";

function ConvertStatesToObjects(rawStates: OpenSkyStatesResponse): OpenSkyStates {
  const stateVecToObject = (stateVector: OpenSkyStateVector): OpenSkyStateObject => {
    {
      const [
        icao24,
        callsign,
        origin_country,
        time_position,
        last_contact,
        longitude,
        latitude,
        baro_altitude,
        on_ground,
        velocity,
        true_track,
        vertical_rate,
        sensors,
        geo_altitude,
        squawk,
        spi,
        position_source,
        category
      ] = stateVector;

      return {
        icao24,
        callsign,
        origin_country,
        time_position,
        last_contact,
        longitude,
        latitude,
        baro_altitude,
        on_ground,
        velocity,
        true_track,
        vertical_rate,
        sensors,
        geo_altitude,
        squawk,
        spi,
        position_source,
        category
      };
    }
  }

  const newStates = rawStates.states.map(stateVecToObject)

  return { ...rawStates, states: newStates }
}


export async function fetchStatesFromOpenSky(config: Config): Promise<StatesPreparedForPrediction> {
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

  const rawStates: OpenSkyStatesResponse = await response.json()
  const statesObject: OpenSkyStates = ConvertStatesToObjects(rawStates)

  return parseOpenSkyResponse(config, statesObject)
}

function parseOpenSkyResponse(config: Config, aircraftStates: OpenSkyStates): StatesPreparedForPrediction {
  const timestamp = aircraftStates.time

  const pixels: boolean[][] = Array.from({ length: config.yLength }, () =>
    Array.from({ length: config.xLength }, () => false)
  );
  const latMin = config.HeathrowLat - config.latOffset;
  const longMin = config.HeathrowLong - config.longOffset;

  const xBinSize = (config["longOffset"] * 2) / config["xLength"];
  const yBinSize = (config["latOffset"] * 2) / config["yLength"];

  if (aircraftStates.states == null) {
    return { timestamp, pixels, aircraftStates }
  }
  for (let i in aircraftStates.states) {
    const long = aircraftStates.states[i]["longitude"]
    const lat = aircraftStates.states[i]["latitude"]

    // If no lat or no long ignore aircraft
    if (lat === null || long === null) {
      console.log(`Skipped ${aircraftStates.states[i]}, no lat and/or no long`)
      continue
    }

    const offsetLat = lat - latMin
    const offsetLong = long - longMin

    let x = Math.trunc(offsetLong / xBinSize)
    let y = Math.trunc(offsetLat / yBinSize)

    if ((x >= 0 && x < config["xLength"]) &&
      (y >= 0 && y < config["yLength"])) {
      pixels[y][x] = true
    } else {
      console.log(`Failed to get(${x}, ${y})`)
    }
  }
  return { timestamp, pixels, aircraftStates }
}
