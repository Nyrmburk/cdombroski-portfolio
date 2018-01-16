// a preset feedforward neural network
// don't hate me for not making it all fancy and resizable and reusable
// this is merely an adaption of an adaption of one that was like that
// so this is based off one that I had to create really fast for a class

const INPUT_LAYER = 0;
const FIRST_SYNAPSES = 1;
const PROCESSING_LAYER = 2;
const SECOND_SYNAPSES = 3;
const OUTPUT_LAYER = 4;
function feedforward(network, inputs) {
	
	// set inputs into the network
	// the inputs for the network is the first layer
	for (var i = 0; i < inputs.length; i++) {
		network[INPUT_LAYER][i] = inputs[i];
	}
	
	// clear the processing layer values
	for (var i = 0; i < network[PROCESSING_LAYER].length; i++) {
		network[PROCESSING_LAYER][i] = 0;
	}
	
	// calculate the new values for the processing layer
	var k = 0;
	for (var i = 0; i < network[INPUT_LAYER].length; i++) {
		for (var j = 0; j < network[PROCESSING_LAYER].length; j++) {
			network[PROCESSING_LAYER][j] += 
					network[INPUT_LAYER][i] * network[FIRST_SYNAPSES][k];
			k++;
		}
	}
	
	// run the activation function on the processing layer
	for (var i = 0; i < network[PROCESSING_LAYER].length; i++) {
		network[PROCESSING_LAYER][i] = 
				activation(network[PROCESSING_LAYER][i]);
	}
	
	// clear the output layer
	for (var i = 0; i < network[OUTPUT_LAYER].length; i++) {
		network[OUTPUT_LAYER][i] = 0;
	}
	
	// calculate the new values for the new output layer
	k = 0;
	for (var i = 0; i < network[PROCESSING_LAYER].length; i++) {
		for (var j = 0; j < network[OUTPUT_LAYER].length; j++) {
			network[OUTPUT_LAYER][j] += 
					network[PROCESSING_LAYER][i] * network[SECOND_SYNAPSES][k];
			k++;
		}
	}
	
	// run the activation function on the output layer
	for (var i = 0; i < network[OUTPUT_LAYER].length; i++) {
		network[OUTPUT_LAYER][i] = activation(network[OUTPUT_LAYER][i]);
	}
	
	return network[OUTPUT_LAYER];
}

function activation(x) {
	return 1 / (1 + Math.exp(-x));
}