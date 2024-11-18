async function run_model(state) {
	console.log("running model")
	const session = await ort.InferenceSession.create("./model.onnx")
	const inp = Float32Array.from(state.flat(Infinity))
	const tensor = new ort.Tensor("float32", inp, [1, 64, 32])

	const feeds = { input: tensor }
	const results = await session.run(feeds)
	return results.output.data
}


async function result_to_state(data, config) {

	const maxN = Math.max.apply(null, data);
	console.log("data - ", data)
	const argMax = data.indexOf(maxN);

	const state = config["states"][argMax];

	var elem = document.createElement("p");
	const txt = document.createTextNode(`State is ${state} with ${Math.round(data[argMax] * 1000) / 10}% confidence`)
	elem.appendChild(txt)

	return [data, elem]
}

async function get_config() {
	return fetch("config_link.json").then((config) => config.json())
}

async function make_inference(state) {
	const res = await run_model(state)
	const config = await get_config()
	const vals = await result_to_state(res, config)
	return vals
}
