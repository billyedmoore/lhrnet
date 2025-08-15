import React, { type PropsWithChildren } from 'react';
import { type Prediction } from '../predict';
import { type Config } from '../types';
import { PredictionComponent } from '../PredictionComponent';
import { PositionMap } from './PositionMap';
import { UselessStats } from './UselessStats';
import { OriginPie } from './OriginPie';
import { FastestCraft } from './FastestCraft';
import { LowestCraft } from './LowestCraft';
import type { OpenSkyStates } from '../open-sky';

const StatElem: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="max-w-140 w-full h-64 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-5">{children}</div>
}

interface StatsForNerdsProps {
  prediction: Prediction,
  config: Config
}

export interface StatsForNerdsElemProps {
  aircraftStates: OpenSkyStates,
}

export interface StatsForNerdsElemWithConfigProps {
  aircraftStates: OpenSkyStates,
  config: Config
}

export const StatsForNerds: React.FC<StatsForNerdsProps> = ({ prediction, config }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-5 max-sm:basis-9/10 max-sm:py-10">
      <PredictionComponent prediction={prediction} />

      <StatElem>
        <PositionMap aircraftStates={prediction.aircraftStates} config={config} />
      </StatElem>

      <StatElem>
        <UselessStats aircraftStates={prediction.aircraftStates} />
      </StatElem>

      <StatElem>
        <LowestCraft aircraftStates={prediction.aircraftStates} />
      </StatElem>

      <StatElem>
        <FastestCraft aircraftStates={prediction.aircraftStates} />
      </StatElem>

      <StatElem>
        <OriginPie aircraftStates={prediction.aircraftStates} />
      </StatElem>

    </div>)

}
