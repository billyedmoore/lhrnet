import React from 'react';
import { StatBoxTitle } from './StatBoxTitle';
import type { StatsForNerdsElemProps } from './StatsForNerds';

export const FastestCraft: React.FC<StatsForNerdsElemProps> = ({ aircraftStates }) => {

  const fastestCraft = aircraftStates.states.reduce((max, current) => {
    return ((current.velocity ?? 0) > (max.velocity ?? 0)) ? current : max;
  }, aircraftStates.states[0]);


  return (
    <>
      <StatBoxTitle title="FASTEST-CRAFT" />
      <div className='flex flex-col flex-grow items-center justify-center h-full pb-6'>
        <p>The fastest aircraft is</p>
        <p className="font-mono text-4xl">{(fastestCraft.callsign ?? "unknown").trim()}</p>
        <p> With a speed of</p>
        <p className="font-mono text-4xl">{fastestCraft.velocity}</p>
        <p> meters per second.</p>
      </div>
    </>)
}
