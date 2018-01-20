// a pre-trained model for the MNIST database

var network = []; // 5 sections
downloadNetwork("model/network.dat");

function initializeNetwork(data) {
	network.length = 5;
	(network[0] = []).length = 784; // 784 (28 x 28) inputs
	(network[2] = []).length = 40; // processing layers
	(network[4] = []).length = 10; // output layers
	
	var firstLength = 784 * 40;
	var secondLength = 784 * 40;
	var synapses = new Float32Array(data);
	
	// first synapses
	network[1] = synapses.slice(0, firstLength);

	// second synapses
	network[3] = synapses.slice(firstLength, firstLength + secondLength);
}

function downloadNetwork(url) {
	var xhr = new XMLHttpRequest(); 
	xhr.open("GET", url); 
	xhr.responseType = "arraybuffer";
	xhr.onload = function() {
		initializeNetwork(xhr.response);
	}
	xhr.send();
};