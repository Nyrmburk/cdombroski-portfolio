const INPUT_SIZE = 28;
const SCALE = 8;
window.addEventListener('load', function() {
	
	var digitsAIs = document.getElementsByClassName("digitsAI");

	for (var i = 0; i < digitsAIs.length; i++) {
		var digitsAI = digitsAIs[i];
		
		// add all elements
		var canvas = digitsAI.getElementsByClassName("digitInput")[0];
		resizeInput(canvas);
		
		var clearButton = digitsAI.getElementsByClassName("digitClear")[0];
		clearButton.innerText = "clear";
		
		var normalizedCanvas = digitsAI.getElementsByClassName("digitRaw")[0];
		normalizedCanvas.width = INPUT_SIZE;
		normalizedCanvas.height = INPUT_SIZE;
		
		var resultDisplay = digitsAI.getElementsByClassName("digitGuess")[0];
		
		// rendering
		var context = canvas.getContext("2d");
		
		var radius = 10;
		context.strokeStyle = "#FFFFFF";
		context.lineJoin = "round";
		context.lineCap = "round";
		context.lineWidth = radius + radius;
		
		// mouse events
		var shouldPaint = false;
		var strokes = [];
		
		function start(e, x, y) {
			e.preventDefault();

			shouldPaint = true;
			
			context.beginPath();
			context.ellipse(x, y, 0, 0, 0, 0, Math.PI + Math.PI);
			context.closePath();
			context.stroke();
			
			context.moveTo(x, y);
			context.beginPath();

			var stroke = [];
			stroke.push({
				x: x,
				y: y
			});
			strokes.push(stroke);
			
			normalize(strokes, normalizedCanvas);
		}
		canvas.addEventListener('mousedown', function(e) {
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;
			start(e, x, y);
		});
		canvas.addEventListener('touchstart', function(e) {
			var x = e.targetTouches[0].pageX - this.offsetLeft;
			var y = e.targetTouches[0].pageY - this.offsetTop;
			start(e, x, y);
		});
		
		function move(e, x, y) {
			e.preventDefault();
			if (!shouldPaint) {
				return;
			}

			context.lineTo(x, y);
			context.moveTo(x, y);
			context.closePath();
			context.stroke();

			var stroke = strokes[strokes.length - 1];
			stroke.push({
				x: x,
				y: y
			});

			normalize(strokes, normalizedCanvas);
		}
		canvas.addEventListener('mousemove', function(e) {
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;
			move(e, x, y);
		});
		canvas.addEventListener('touchmove', function(e) {
			var x = e.targetTouches[0].pageX - this.offsetLeft;
			var y = e.targetTouches[0].pageY - this.offsetTop;
			move(e, x, y);
		});
		
		function end(e) {
			if (!shouldPaint) {
				// prevent displaying a result if the user never interacted
				// with the drawing area
				return;
			}

			shouldPaint = false;
			
			var input = getInput(normalizedCanvas);
			var result = run(network, input);
			resultDisplay.innerText = result.firstGuessIndex;
		}
		document.addEventListener('mouseup', end);
		document.addEventListener('touchend', end);
		
		// clear button
		function clear() {
			context.fillRect(0, 0, canvas.width, canvas.height);
			downscale(canvas, normalizedCanvas);
			strokes.length = 0;
			resultDisplay.innerText = "";
		};
		clear();
		clearButton.onclick = clear;
	};
});

function resizeInput(canvas) {
	var size = INPUT_SIZE * SCALE;
	canvas.width = size;
	canvas.height = size;
}

function normalize(strokes, normalizedCanvas) {
	var size = 100;
	// MNIST maps a 20x20 image onto a 28x28, so 4 pixel borders
	var boundedStrokes = bound(strokes, {x: size, y: size}, 4/INPUT_SIZE * size);

	var intermediate = renderIntermediate(size, boundedStrokes)
	var center = centerOfMass(intermediate);
	var offset = {
		x: size / 2 - center.x,
		y: size / 2 - center.y
	}

	for (let stroke of boundedStrokes) {
		for (let point of stroke) {
			point.x += offset.x;
			point.y += offset.y;
		}
	}

	intermediate = renderIntermediate(size, boundedStrokes)
	downscale(intermediate, normalizedCanvas);
}

function renderIntermediate(size, strokes) {
	// Create a canvas element
	var intermediate = document.createElement('canvas');
	intermediate.width = size;
	intermediate.height = size;
	var ctx = intermediate.getContext('2d');
	ctx.fillRect(0, 0, intermediate.width, intermediate.height);
	var intermediateRadius = (2.5/INPUT_SIZE) * size / 2; // MNIST appears to be about a 2.5 pixel stroke
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineWidth = intermediateRadius + intermediateRadius;

	for (let stroke of strokes) {
		var lastX = 0;
		var lastY = 0;
		var start = true;
		for (let point of stroke) {
			if (start) {
				start = false;
				ctx.moveTo(point.x, point.y);
			} else {
				ctx.moveTo(lastX, lastY);
			}
			ctx.lineTo(point.x, point.y);
			lastX = point.x;
			lastY = point.y;
		}
		ctx.closePath();
	}
	ctx.stroke();
	return intermediate;
}

function bound(strokes, size, border = 0) {
	var min = {
		x: strokes[0][0].x,
		y: strokes[0][0].y
	};
	var max = {
		x: strokes[0][0].x,
		y: strokes[0][0].y
	};

	for (let stroke of strokes) {
		for (let point of stroke) {
			min.x = Math.min(min.x, point.x);
			min.y = Math.min(min.y, point.y);
			max.x = Math.max(max.x, point.x);
			max.y = Math.max(max.y, point.y);
		}
	}

	var min = Math.min(min.x, min.y);
	var max = Math.max(max.x, max.y);
	var boundedStrokes = [];
	for (let stroke of strokes) {
		var boundedStroke = [];
		boundedStrokes.push(boundedStroke);
		for (let point of stroke) {
			var boundedPoint = {
				x: mapRange(point.x, min, max, border, size.x - border),
				y: mapRange(point.y, min, max, border, size.y - border),
			}
			boundedStroke.push(boundedPoint);
		}
	}

	return boundedStrokes;
}

function mapRange(x, fromStart, fromEnd, toStart, toEnd) {
	return toStart + (x - fromStart) * (toEnd - toStart) / (fromEnd - fromStart);
}

function downscale(canvas, downscaledCanvas) {
	var context = downscaledCanvas.getContext("2d");
	context.drawImage(canvas,
			0, 0, canvas.width, canvas.height,
			0, 0, downscaledCanvas.width, downscaledCanvas.height);
}

function centerOfMass(canvas) {
	var centerOfMass = {
		x: 0,
		y: 0
	};
	var mass = 0;

	var context = canvas.getContext("2d");
	data = context.getImageData(0, 0, canvas.width, canvas.height).data;
	for (let i = 0; i < data.length; i += 4) {
		// calculate max brightness per channel to get brightness
		var brightness = data[i]; // red
		brightness = Math.max(brightness, data[i + 1]); // green
		brightness = Math.max(brightness, data[i + 2]); // blue

		brightness /= 255.0; // normalize from [0, 255] to [0, 1]

		// multiply by opacity
		brightness *= data[i + 3] / 255.0;

		var x = (i / 4) % canvas.width + 0.5;
		var y = Math.floor(i / (4 * canvas.width)) + 0.5;

		mass += brightness;
		centerOfMass.x += x * brightness;
		centerOfMass.y += y * brightness;
	}

	centerOfMass.x /= mass;
	centerOfMass.y /= mass;

	return centerOfMass;
}

function getInput(normalizedCanvas) {
	
	var context = normalizedCanvas.getContext("2d");
	
	var input = [];
	input.length = INPUT_SIZE * INPUT_SIZE;
	
	var data = context.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE).data;
	
	for (var i = 0; i < input.length; i++) {
		input[i] = data[i * 4] / 255;
	}
	
	return input;
}

function run(network, input) {
	
	var output = feedforward(network, input);
	
	var firstGuess = output[0];
	var firstGuessIndex = 0;
	var secondGuessIndex = -1;
	for (var i = 1; i < output.length; i++) {
		if (output[i] > firstGuess) {
			firstGuess = output[i];
			secondGuessIndex = firstGuessIndex;
			firstGuessIndex = i;
			
		}
	}
	
	return {firstGuessIndex, secondGuessIndex};
}
