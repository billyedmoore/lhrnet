import type { Config } from './predict/types';
import React, { type PropsWithChildren } from 'react';
import config from "./assets/prediction-config.json"
import type { Prediction } from './predict/predict'
import { predict } from './predict/predict';

const PredictionRow: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex items-center justify-center space-x-2 flex-col sm:flex-row flex-wrap">{children}</div>
}

interface RunwayNameProps {
  runwayName: string
}

const RunwayName: React.FC<RunwayNameProps> = ({ runwayName }) => {
  return <div className="flex space-x-2 items-center"><EmphText>{runwayName}</EmphText><p> {runwayName === "BOTH" ? "runways" : "runway"}</p></div>

}

interface PredictionProps {
  prediction: Prediction;
}

const DayPrediction: React.FC<PredictionProps> = ({ prediction }) => {

  const formatRunwayName = (name: "Northern" | "Southern" | "Both" | undefined) => {
    switch (name) {
      case "Northern":
        return "NORTH";
      case "Southern":
        return "SOUTH";
      case "Both":
        return "BOTH";
      default:
        console.error("Trying to display runway name whilst undefined.");
        return "?"
    }
  }

  return (<div className="grid text-4xl space-y-4 sm:space-y-2">
    <PredictionRow><p>Direction is </p><EmphText>{prediction.predictedState.direction?.toUpperCase()}</EmphText></PredictionRow>
    <PredictionRow><p>Landing on </p><RunwayName runwayName={formatRunwayName(prediction.predictedState.arrivals)} /></PredictionRow>
    <PredictionRow><p>Taking off from </p><RunwayName runwayName={formatRunwayName(prediction.predictedState.departures)} /></PredictionRow >
    <div className="flex items-center justify-center"><QuietText> Confidence [0,1] is {prediction.probability} </QuietText></div>
  </div >)
}

const NightPrediction: React.FC<PredictionProps> = ({ prediction }) => {

  return (<div className="grid text-4xl space-y-4 sm:space-y-2">
    <PredictionRow><p>Heathrow Airport is </p><EmphText> SLEEPING</EmphText></PredictionRow>
    <div className="flex items-center justify-center"><QuietText> Shhhhh... Confidence [0,1] is {prediction.probability} </QuietText></div>
  </div >)
}

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
      <div className="w-30 h-30 border-15 rounded-full animate-spin border-l-fuchsia-400 border-fuchsia-300 dark:border-l-fuchsia-950 dark:border-fuchsia-900 animate-spin motion-reduce:hidden"></div>
      <div className="text-4xl motion-safe:hidden"><p>Loading...</p></div>
    </div>
  )
}

const EmphText: React.FC<PropsWithChildren> = ({ children }) => {
  return (<p className="font-mono text-6xl" >{children}</p>)
}

const QuietText: React.FC<PropsWithChildren> = ({ children }) => {
  return (<p className="text-sm space-y-2" >{children}</p>)
}


const AirportState: React.FC = () => {
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
      {prediction ?
        (prediction.predictedState.night ? <NightPrediction prediction={prediction} /> : <DayPrediction prediction={prediction} />)
        : <LoadingSpinner />}
    </>
  );
};

export default AirportState;
