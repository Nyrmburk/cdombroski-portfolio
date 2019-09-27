var phraseIndex = 0;
var phrases = [
	"This should cycle through some dumb phrases.",
	"I make things.",
	"Wow this website looks good!",
	"<a href='https://source.android.com/security/overview/release-acknowledgements'>CVE-2019-9268</a>!",
	"Pretty good.",
	"I AM TOTALLY NOT A ROBOT.",
	"I’m probably locked in my room playing with LEGO.",
	"It’s a Unix system, I know this.", 
	"Did I mention that I would like a job?",
	":(){:|:&};:",
	"Some days even my lucky rocket ship underpants don’t help.",
	"Christopher Dombroccoli.",
	"HTML is the best programming language.",
	"People who put noses in smiley faces are heathens.",
	":-)",
	"I build robots for fun.",
	"Programmer Extraordinaire.",
	"I'm pretty sure we're all in a simulation.",
	"My favorite color is <font color=\"#fb8c68\">orange</font>.",
	"Have a nice day!",
	"I just finished a jigsaw puzzle. The package said 5+ years but it only took me 2 months.",
	"I should have bought Bitcoin.",
	"I use <i>coding</i> and <i>algorithms</i> to solve problems.",
	"The language I like to use most when programming is profanity.",
	"I'm probably showing this to you during an interview.",
	"if ( !isWorking() ) { <br>&emsp;work();<br>}",
	"Arrays should start at 2.",
	"\"This shouldn't be working.\"",
	"There's no place like ~",
	"1 line change. In and out. 20 hour adventure.",
];

function updateTicker() {
	
	var ticker = document.getElementById("ticker");
	
	if (ticker.parentElement.querySelector(":hover") === ticker)
		return; // mouse is over the ticker and we don't want to skip it.
	
	ticker.className += "fade";

	var phrase = phrases[phraseIndex % phrases.length];
	phraseIndex++;
	
	var delay = Math.floor(parseFloat(window.getComputedStyle(ticker)["transitionDuration"]) * 1000);
	setTimeout(function() {
		ticker.classList.remove("fade");
		ticker.innerHTML = phrase;
	}, delay);
}

var fadeElements;
window.onload = function() {
	setInterval(updateTicker, 3000);
	fadeElements = document.getElementsByClassName("scrollfade");
};

window.onscroll = function() {
	
	if (!fadeElements)
		return;
	for (var i = 0; i < fadeElements.length; i++) {
		
		var element = fadeElements[i];
		
		var offset = 3 * element.offsetHeight;
		var scroll = pageYOffset;
		var opacity = (offset - scroll) / offset;
		
		if (opacity < 0) {
			element.style.opacity = 0;
		} else if (opacity > 1) {
			element.style.opacity = 1;
		} else {
			element.style.opacity = opacity * opacity;
		}
	}
}
