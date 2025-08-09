import * as ort from 'onnxruntime-web';
import type { Config } from './types';

export async function runModel(state: boolean[][], model_path: string, config: Config) {
  console.log(`Running model ${model_path}`)
  let session: ort.InferenceSession;
  try {
    session = await ort.InferenceSession.create(model_path)
  }
  catch (e) {
    console.log(e)
    throw new Error(`Failed to create inference session, maybe WASM is not available.`)
  }
  const flatNumericArr = state.flat(Infinity).map(bool => (bool ? 1 : 0));
  const inp = Float32Array.from(flatNumericArr);
  const tensor = new ort.Tensor("float32", inp, [1, 32, 64]);

  const feeds = { input: tensor }
  const results = await session.run(feeds)

  const data: Float32Array = await results.output.getData() as Float32Array

  console.log(data)

  const highestProb = Math.max(...data)
  const predictedStateIndex = data.indexOf(highestProb);

  return { predictedState: config.states[predictedStateIndex], probability: highestProb }
}
