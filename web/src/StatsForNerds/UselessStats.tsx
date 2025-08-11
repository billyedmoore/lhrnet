import { type OpenSkyStates } from '../open-sky';
import { StatBoxTitle } from './StatBoxTitle';
import React from 'react';



interface UselessStatsProps {
  aircraftStates: OpenSkyStates
}

export const UselessStats: React.FC<UselessStatsProps> = ({ aircraftStates }) => {

  const uniqueCountries = new Set(aircraftStates.states.map((s) => { return s.origin_country }))
  const totalSpeed = aircraftStates.states.reduce((acc, s) => {
    if (s.velocity) {
      acc += s.velocity
    }
    return acc
  }, 0).toFixed(2)
  const highestAlt = Math.max(...aircraftStates.states.map((s) => { return (s.geo_altitude ? s.geo_altitude : 0) })).toFixed(2)
  const emergencies = aircraftStates.states.reduce((count, state) => {
    if (state.squawk && [7500, 7600, 7700].includes(Number(state.squawk))) {
      count += 1
    }
    return count
  }, 0)

  return (
    <>
      <StatBoxTitle title="USELESS-STATS" />
      <div className="grid grid-col-1 sm:py-5 max-sm:text-sm">
        <p>There are <b className="font-mono">{aircraftStates.states.length}</b> aircraft in the rectangle.</p>
        <p>There are aircraft registered in <b className="font-mono">{uniqueCountries.size}</b> different countries.</p>
        <p>The highest aircraft has a geometric altitude of <b className="font-mono">{highestAlt}</b> meters. </p>
        <p>There are <b className="font-mono">{emergencies}</b> aircraft currently squawking an emergency.</p>
        <p>The combined speed of all planes is <b className="font-mono">{totalSpeed}</b> meters per second.</p>
      </div>
    </>)
}
