import React, { type PropsWithChildren } from 'react';
import { type Prediction } from '../predict';
import { type Config } from '../types';
import { PredictionComponent } from '../PredictionComponent';
import { PositionMap } from './PositionMap';



const StatElem: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="max-w-140 w-full h-64 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-5">{children}</div>
}

interface StatsForNerdsProps {
  prediction: Prediction,
  config: Config
}

export const StatsForNerds: React.FC<StatsForNerdsProps> = ({ prediction, config }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4 max-sm:basis-9/10 max-sm:py-10">
      <PredictionComponent prediction={prediction} />

      <StatElem>
        <PositionMap aircraftStates={prediction.aircraftStates} config={config} />
      </StatElem>

      <StatElem>
        <PositionMap aircraftStates={prediction.aircraftStates} config={config} />
      </StatElem>

      <StatElem>
        <PositionMap aircraftStates={prediction.aircraftStates} config={config} />
      </StatElem>

      <StatElem>
        <PositionMap aircraftStates={prediction.aircraftStates} config={config} />
      </StatElem>

      <StatElem>
        <PositionMap aircraftStates={prediction.aircraftStates} config={config} />
      </StatElem>

    </div>)

}
