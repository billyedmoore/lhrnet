import React, { type PropsWithChildren } from 'react';
import type { Prediction } from './predict/predict'

const EmphText: React.FC<PropsWithChildren> = ({ children }) => {
  return (<p className="font-mono text-6xl" >{children}</p>)
}

const QuietText: React.FC<PropsWithChildren> = ({ children }) => {
  return (<p className="text-sm space-y-2" >{children}</p>)
}


const PredictionRow: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex items-center justify-center space-x-2 flex-col sm:flex-row flex-wrap">{children}</div>
}

interface RunwayNameProps {
  runwayName: string
}

const RunwayName: React.FC<RunwayNameProps> = ({ runwayName }) => {
  return <div className="flex space-x-2 items-center"><EmphText>{runwayName}</EmphText><p> {runwayName === "BOTH" ? "runways" : "runway"}</p></div>

}

export interface PredictionProps {
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


export const PredictionComponent: React.FC<PredictionProps> = ({ prediction }) => {
  return (
    <>
      {prediction.predictedState.night ? <NightPrediction prediction={prediction} /> : <DayPrediction prediction={prediction} />}
    </>)
}
