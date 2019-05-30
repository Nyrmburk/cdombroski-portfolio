// slideshow controller

window.addEventListener('load', function() {
	resizeTime = Date.now();
	
	var slideshows = document.getElementsByClassName("slideshow");
	
	for (var i = 0; i < slideshows.length; i++) {
		var slideshow = slideshows[i];

		var observer = new IntersectionObserver(function(entries) {
			for (let j = 0; j < entries.length; j++) {
				var entry = entries[j];
				if (!entry.isIntersecting)
					continue;

				// a delay is needed to prevent the observer event from
				// firing before the resize event.
				window.requestAnimationFrame(function() {
					var now = Date.now();
					if (now - resizeTime < 50) {
						// resized in between intersection event
						return;
					}
					setSlide(entry.target, false);
				});
			}
		}, {root: slideshow, threshold: 0.55});

		var slides = slideshow.getElementsByClassName("slide");
		for (let j = 0; j < slides.length; j++) {
			var slide = slides[j];
			slide.index = j;
			observer.observe(slide);
		}

		createSelectors(slideshow);
		
		var caption = document.createElement("div");
		caption.classList.toggle("caption");
		slideshow.appendChild(caption);
		
		setSlideIndex(slideshow, 0, false);
	}
	
	var images = document.getElementsByTagName("img");
	
	for (var i = 0; i < images.length; i++) {
		var image = images[i];
		
		var srcUrl = image.dataset.src;
		
		if (srcUrl) {
			loadImage(image, function(img) {
				img.style.filter = "unset";
			});
		} else {
			image.style.filter = "unset";
		}
	}
	
	function loadImage (el, fn) {
		var img = new Image();
		var src = image.dataset.src;
		img.onload = function() {
			if (!! el.parent) {
				el.parent.replaceChild(img, el)
			} else {
				el.src = src;
			}

			if (fn) {
				fn(el);
			}
		}
		img.src = src;
	}

	function createSelectors(slideshow) {
		var selectors = document.createElement("div");
		selectors.classList.toggle("selectors");

		var prev = document.createElement("a");
		prev.classList.toggle("prev");
		prev.classList.toggle("selector");
		prev.innerHTML = "&#10094;";
		prev.onclick = function() {
			var m_slideshow = slideshow;
			var index = m_slideshow.currentSlide.index;
			setSlideIndex(m_slideshow, index - 1);
		};
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
				return function() {setSlideIndex(m_slideshow, index);};
			}();
			selectors.appendChild(selector);
		}

		var next = document.createElement("a");
		next.classList.toggle("next");
		next.classList.toggle("selector");
		next.innerHTML = "&#10095;";
		next.onclick = function() {
			var m_slideshow = slideshow;
			var index = m_slideshow.currentSlide.index;
			setSlideIndex(m_slideshow, index + 1);
		};
		selectors.appendChild(next);

		slideshow.appendChild(selectors);
	}
});

function setSlide(slide, scroll = true) {
	var slideshow = slide.parentElement.parentElement;
	setSlideIndex(slideshow, slide.index, scroll);
}

function setSlideIndex(slideshow, index, scroll = true) {
	var slides = slideshow.getElementsByClassName("slide");
	
	index = mod(index, slides.length);
	var slide = slides[index];

	if (scroll) {
		slide.scrollIntoView({
			behavior: "smooth",
			inline: "center",
			block: "center"
		});
	}

	var captions = slideshow.getElementsByClassName("caption");
	for (let i = 0; i < captions.length; i++) {
		captions[i].innerText = slide.dataset.caption;
	}
	
	var selectorContainer = slideshow.getElementsByClassName("selectors");
	for (var i = 0; i < selectorContainer.length; i++) {
		var selectors = selectorContainer[i].getElementsByClassName("selector");
		if (slideshow.currentSlide) {
			selectors[slideshow.currentSlide.index + 1].classList.remove("selectorActive");
		}
		selectors[slide.index + 1].classList.add("selectorActive");
	}
	slideshow.currentSlide = slide;
}

function mod(n, m) {
	return ((n % m) + m) % m;
}

function scrollToSlide(slide) {
	var x = window.scrollX;
	var y = window.scrollY;
	slide.scrollIntoView({
		behavior: "auto",
		inline: "center",
	});

	window.scrollTo(x, y);
}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

window.addEventListener('resize', function() {
	var slideshows = document.getElementsByClassName("slideshow");
	for (let i = 0; i < slideshows.length; i++) {
		var slideshow = slideshows[i];
		scrollToSlide(slideshow.currentSlide);
	}
	resizeTime = Date.now();
});
