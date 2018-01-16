// slideshow controller

window.addEventListener('load', function() {
	
	var slideshows = document.getElementsByClassName("slideshow");
	
	for (var i = 0; i < slideshows.length; i++) {
		var slideshow = slideshows[i];
		
		slideshow.index = 0;
		slideshow.previous = 0;
		
		var selectors = document.createElement("div");
		selectors.className += "selectors";
		
		var prev = document.createElement("a");
		prev.classList.toggle("prev");
		prev.classList.toggle("selector");
		prev.innerHTML = "&#10094;";
		prev.onclick = function() {
				var m_slideshow = slideshow;
				return function() {setSlide(m_slideshow, --m_slideshow.index)};
			}();
		selectors.appendChild(prev);
		
		var length = slideshow.getElementsByClassName("slide").length;
		for (var j = 0; j < length; j++) {
			var selector = document.createElement("a");
			selector.classList.toggle("selector");
			selector.index = j;
			selector.innerText = j;
			selector.onclick = function() {
				var m_slideshow = slideshow;
				var index = j;
				return function() {
						m_slideshow.index = index;
						setSlide(m_slideshow, index)
					};
			}();
			selectors.appendChild(selector);
		}

		var next = document.createElement("a");
		next.classList.toggle("next");
		next.classList.toggle("selector");
		next.innerHTML = "&#10095;";
		next.onclick = function() {
				var m_slideshow = slideshow;
				return function() {setSlide(m_slideshow, ++m_slideshow.index)};
			}();
		selectors.appendChild(next);
		
		slideshow.appendChild(selectors);
		
		var caption = document.createElement("div");
		caption.classList.toggle("caption");
		slideshow.appendChild(caption);
		
		var nextSlide = (function() {
			var data = slideshow;
			return function() {
				setSlide(data, ++data.index);
			};
		})();
		
		setSlide(slideshow, 0);
		//setInterval(nextSlide, 5000);
	}
});

function setSlide(slideshow, index) {
	var slides = slideshow.getElementsByClassName("slide");
	
	index = mod(index, slides.length);
	var slide = slides[index];
	
	slides[slideshow.previous].style.display = "";
	slide.style.display = "block";
	
	var captions = slideshow.getElementsByClassName("caption");
	for (var i = 0; i < captions.length; i++) {
		var caption = captions[i];
		caption.innerHTML = slide.dataset.caption;
	}
	
	var selectorContainer = slideshow.getElementsByClassName("selectors");
	for (var i = 0; i < selectorContainer.length; i++) {
		var selectors = selectorContainer[i].getElementsByClassName("selector");
		selectors[slideshow.previous + 1].classList.remove("selectorActive");
		selectors[index + 1].classList.add("selectorActive");
	}
	
	slideshow.previous = index;
}

function mod(n, m) {
        return ((n % m) + m) % m;
}