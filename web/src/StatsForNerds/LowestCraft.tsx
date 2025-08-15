import React from 'react';
import { StatBoxTitle } from './StatBoxTitle';
import type { StatsForNerdsElemProps } from './StatsForNerds';

export const LowestCraft: React.FC<StatsForNerdsElemProps> = ({ aircraftStates }) => {

  const lowestCraft = aircraftStates.states.reduce((min, current) => {
    return ((current.geo_altitude ?? Number.POSITIVE_INFINITY) < (min.geo_altitude ?? Number.POSITIVE_INFINITY)) ? current : min;
  }, aircraftStates.states[0]);


  return (
    <>
      <StatBoxTitle title="LOWEST-CRAFT" />
      <div className='flex flex-col flex-grow items-center justify-center h-full pb-6'>
        <p>The lowest aircraft is</p>
        <p className="font-mono text-4xl">{(lowestCraft.callsign ?? "unknown").trim()}</p>
        <p> With geometric altitude of</p>
        <p className="font-mono text-4xl">{lowestCraft.velocity}</p>
        <p>meters.</p>
        <p>Watch your head!</p>
      </div>
    </>)
}
