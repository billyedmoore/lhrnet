import type { Config } from './types';
import React from 'react';
import config from "./assets/prediction-config.json"
import type { Prediction } from './predict/predict'
import { predict } from './predict';
import { StatsForNerds } from './StatsForNerds';
import { PredictionComponent } from './PredictionComponent';


interface PredictionErrorProps {
  error: Error
}

const PredictionError: React.FC<PredictionErrorProps> = ({ error }) => {
  return (
    <div className="flex w-3/4 justify-center items-center text-3xl">
      <p className="bg-red-300 dark:bg-red-950 rounded-xl p-8"><b>{error.name}</b>{` - ${error.message}`}</p>
    </div >)
}

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-30 h-30 border-15 rounded-full border-l-fuchsia-400 border-fuchsia-300 dark:border-l-fuchsia-950 dark:border-fuchsia-900 animate-spin motion-reduce:hidden"></div>
      <div className="text-4xl motion-safe:hidden"><p>Loading...</p></div>
    </div>
  )
}

interface AirportStateProps {
  enableStatsForNerds: boolean
}

const AirportState: React.FC<AirportStateProps> = ({ enableStatsForNerds }) => {
  const predictionConfig: Config = config as Config

  const [prediction, setPrediction] = React.useState<null | Prediction>(null)
  const [err, setError] = React.useState<null | Error>(null)

  React.useEffect(() => {
    predict(predictionConfig).then(prediction => setPrediction(prediction)).catch(error => setError(error))
  }, [])

  if (err != null) {
    return <PredictionError error={err} />
  }

  return (
    <>
      {prediction ? (
        enableStatsForNerds ? <StatsForNerds prediction={prediction} /> : <PredictionComponent prediction={prediction} />)
        : <LoadingSpinner />}
    </>
  );
};

export default AirportState;
