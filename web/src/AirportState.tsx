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


const EmphText: React.FC<PropsWithChildren> = ({ children }) => {
  return (<p className="font-mono text-6xl" >{children}</p>)
}

const QuietText: React.FC<PropsWithChildren> = ({ children }) => {
  return (<p className="text-sm space-y-2" >{children}</p>)
}

const AirportState: React.FC = () => {
  // @ts-ignore: The json seems fine, fingers crossed. Times like this I wish json had static types.
  const predictionConfig: Config = config

  const [prediction, setPrediction] = React.useState<null | Prediction>(null)

  React.useEffect(() => {
    // TODO: have an error state and handle the errors
    predict(predictionConfig).then(prediction => setPrediction(prediction))
  }, [])

  return (
    <>
      {prediction ?
        (prediction.predictedState.night ? <NightPrediction prediction={prediction} /> : <DayPrediction prediction={prediction} />)
        : <p> LOADING ... </p>}
    </>
  );
};

export default AirportState;
