function create_canvas_from_pixels(parentElem, pixels, enlarge_times, zero_colour = [0, 0, 0, 255], one_colour = [255, 255, 255, 255]) {

	var pix_to_RGBA = pix => {
		if (pix == 0) {
			return zero_colour;
		}
		else if (pix == 1) {
			return one_colour;
		} else {
			throw new Error(`Pixel should be 0 or 1, instead recieved ${pix}`);
		}
	}

	image = []

	for (var row of pixels) {
		for (var i = 0; i < enlarge_times; i++) {
			for (var pix of row) {
				for (var j = 0; j < enlarge_times; j++) {
					image.push(pix_to_RGBA(pix));
				}
			}
		}
	}

	width = pixels[0].length * enlarge_times;
	height = pixels.length * enlarge_times;

	imgData = new ImageData(Uint8ClampedArray.from(image.flat(Infinity)), width, height);
	const canvas = document.createElement("canvas");
	canvas.width = width
	canvas.height = height;
	const context = canvas.getContext("2d");
	context.putImageData(imgData, 0, 0);

	parentElem.appendChild(canvas);


}

