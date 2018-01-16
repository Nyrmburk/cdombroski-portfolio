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
		
		var downscaledCanvas = digitsAI.getElementsByClassName("digitRaw")[0];
		downscaledCanvas.width = INPUT_SIZE;
		downscaledCanvas.height = INPUT_SIZE;
		
		var resultDisplay = digitsAI.getElementsByClassName("digitGuess")[0];
		
		// rendering
		var context = canvas.getContext("2d");
		
		var radius = 13 * window.devicePixelRatio;
		context.strokeStyle = "#FFFFFF";
		context.lineJoin = "round";
		context.lineCap = "round";
		context.lineWidth = radius + radius;
		
		// mouse events
		var shouldPaint = false;
		var previousX = 0;
		var previousY = 0;
		
		function start(e, x, y) {
			e.preventDefault();

			shouldPaint = true;
			
			previousX = x;
			previousY = y;
			
			context.beginPath();
			context.ellipse(x, y, 0, 0, 0, 0, Math.PI + Math.PI);
			context.closePath();
			context.stroke();
			
			context.moveTo(x, y);
			context.beginPath();
			
			downscale(canvas, downscaledCanvas);
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
			if (shouldPaint) {
				context.moveTo(previousX, previousY);
				
				context.lineTo(x, y);
				context.closePath();
				context.stroke();
				
				previousX = x;
				previousY = y;
				downscale(canvas, downscaledCanvas);
			}
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
			e.preventDefault();

			shouldPaint = false;
			
			var input = getInput(downscaledCanvas);
			var result = run(network, input);
			resultDisplay.innerText = result.firstGuessIndex;
		}
		canvas.addEventListener('mouseup', end);
		canvas.addEventListener('touchend', end);
		
		// clear button
		function clear() {
			context.fillRect(0, 0, canvas.width, canvas.height);
			downscale(canvas, downscaledCanvas);
			resultDisplay.innerText = "";
		};
		clear();
		clearButton.onclick = clear;
	};
});

function resizeInput(canvas) {
	var size = INPUT_SIZE * SCALE * window.devicePixelRatio;
	canvas.width = size;
	canvas.height = size;
}

function downscale(canvas, downscaledCanvas) {
	
	var context = downscaledCanvas.getContext("2d");
	context.drawImage(canvas,
			0, 0, canvas.width, canvas.height,
			0, 0, downscaledCanvas.width, downscaledCanvas.height);
}

function getInput(downscaledCanvas) {
	
	var context = downscaledCanvas.getContext("2d");
	
	var input = [];
	input.length = 28 * 28;
	
	var data = context.getImageData(0, 0, 28, 28).data;
	
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