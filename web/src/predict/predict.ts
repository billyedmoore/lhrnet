import type { Config, AirportState } from "../types"
import { fetchStateFromOpenSky } from "../open-sky"
import { runModel } from "./ml-inference"


export type Prediction = {
  timestamp: number,
  predictedState: AirportState,
  probability: number
}

export async function predict(config: Config): Promise<Prediction> {
  const { timestamp, pixels } = await fetchStateFromOpenSky(config)

  //TODO: unhardcode the model.onnx
  const { predictedState, probability } = await runModel(pixels, "./model.onnx", config)

  return { timestamp, predictedState, probability }
}

