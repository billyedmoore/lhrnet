export type PredictionInput = {
  timestamp: number,
  pixels: boolean[][]
}

// The shape of the data returned by the API
export type OpenSkyStatesResponse = {
  time: number,
  states: OpenSkyStateVector[]
}

// The shape of the data after some minimal processing
export type OpenSkyStates = {
  time: number,
  states: OpenSkyStateObject[]
}

enum AircraftCategory {
  NoInformation = 0,
  NoADSB = 1,
  Light = 2,
  Small = 3,
  Large = 4,
  HighVortexLarge = 5,
  Heavy = 6,
  HighPerformance = 7,
  Rotorcraft = 8,
  Glider = 9,
  LighterThanAir = 10,
  Parachutist = 11,
  Ultralight = 12,
  Reserved = 13,
  UAV = 14,
  SpaceVehicle = 15,
  EmergencySurfaceVehicle = 16,
  ServiceSurfaceVehicle = 17,
  PointObstacle = 18,
  ClusterObstacle = 19,
  LineObstacle = 20
}

enum PositionSource {
  ASD_B = 0,
  ASTERIX = 1,
  MLAT = 2,
  FLARM = 3
}

export type OpenSkyStateVector = [
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
  position_source: PositionSource,
  category: AircraftCategory
];

export type OpenSkyStateObject = {
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
  position_source: PositionSource,
  category: AircraftCategory
};
