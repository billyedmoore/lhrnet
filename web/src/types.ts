type DayAirportState = {
  night: false;
  direction: "Westerly" | "Easterly";
  departures: "Southern" | "Northern";
  arrivals: "Southern" | "Northern" | "Both";
}

type NightAirportState = {
  night: true;
  direction?: never;
  departures?: never;
  arrivals?: never;
}

export type AirportState = DayAirportState | NightAirportState

export type Config = {
  HeathrowLat: number;
  HeathrowLong: number;
  latOffset: number;
  longOffset: number;
  xLength: number;
  yLength: number;
  states: AirportState[];
}
