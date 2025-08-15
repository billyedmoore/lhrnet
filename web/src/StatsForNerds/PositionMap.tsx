import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';
import { StatBoxTitle } from './StatBoxTitle';
import type { StatsForNerdsElemWithConfigProps } from './StatsForNerds';

export const PositionMap: React.FC<StatsForNerdsElemWithConfigProps> = ({ aircraftStates, config }) => {

  const centerLat = config["HeathrowLat"]
  const centerLong = config["HeathrowLong"]
  const latMin = centerLat - config["latOffset"];
  const latMax = centerLat + config["latOffset"];
  const longMin = centerLong - config["longOffset"];
  const longMax = centerLong + config["longOffset"];

  return (
    <>
      <StatBoxTitle title="AIRCRAFT-POSITIONS" />
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 15,
            right: 15,
            bottom: 15,
            left: 0,
          }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="longitude"
            name="Longitude"
            unit="°"
            domain={[longMin, longMax]}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <YAxis
            type="number"
            dataKey="latitude"
            name="Latitude"
            unit="°"
            domain={[latMin, latMax]}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Locations" data={aircraftStates.states} fill="#8884d8" />
          <ReferenceDot name="Heathrow" r={5} strokeWidth={2} x={centerLong} y={centerLat} fill="#FFC0CB" />

        </ScatterChart>
      </ResponsiveContainer>
    </>)
}
