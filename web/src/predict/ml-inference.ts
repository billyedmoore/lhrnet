import * as ort from 'onnxruntime-web';
import type { Config } from './types';

export async function runModel(state: boolean[][], model_path: string, config: Config) {
  console.log(`Running model ${model_path}`)
  const session = await ort.InferenceSession.create(model_path)
  const flatNumericArr = state.flat(Infinity).map(bool => (bool ? 1 : 0));
  const inp = Float32Array.from(flatNumericArr);
  const tensor = new ort.Tensor("float32", inp, [1, 32, 64]);

  const feeds = { input: tensor }
  const results = await session.run(feeds)

  // @ts-ignore: Output will be Float32Array because input is Float32Array, can safely
  // assert this type
  const data: Float32Array = await results.output.getData()

  console.log(data)

  const highestProb = Math.max(...data)
  const predicedStateIndex = data.indexOf(highestProb);

  return { predictedState: config.states[predicedStateIndex], probability: highestProb }
}
