import type { Config, AirportState } from "../types"
import { fetchStatesFromOpenSky, type OpenSkyStates } from "../open-sky"
import { runModel } from "./ml-inference"


export type Prediction = {
  timestamp: number,
  aircraftStates: OpenSkyStates,
  predictedState: AirportState,
  probability: number
}

export async function predict(config: Config): Promise<Prediction> {
  const { timestamp, pixels, aircraftStates } = await fetchStatesFromOpenSky(config)

  //TODO: unhardcode the model.onnx
  const { predictedState, probability } = await runModel(pixels, "./model.onnx", config)

  return { timestamp, predictedState, probability, aircraftStates }
}

