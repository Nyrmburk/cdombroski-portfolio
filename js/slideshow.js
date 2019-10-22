// slideshow controller

window.addEventListener('load', function() {
	resizeTime = Date.now();
	
	var slideshows = document.getElementsByClassName("slideshow");
	
	for (var i = 0; i < slideshows.length; i++) {
		var slideshow = slideshows[i];

		// set current slide when the slide is in view
		var slider = slideshow.getElementsByClassName("slider")[0];
		slider.onscroll = function() {
			var m_slideshow = slideshow;
			var m_slider = slider;
			var prevIndex = 0;
			return function() {
				if (Date.now() - resizeTime < 100)
					return;

				var slideIndex = Math.round(
						m_slideshow.slides.length * m_slider.scrollLeft /
						m_slider.scrollWidth);
				if (slideIndex != prevIndex) {
					prevIndex = slideIndex;
					setCurrentSlide(slideFromIndex(m_slideshow, slideIndex));
				}
			}
		}();

		slideshow.slides = slideshow.getElementsByClassName("slide");
		for (let j = 0; j < slideshow.slides.length; j++) {
			var slide = slideshow.slides[j];
			slide.index = j;

			var image = slide.getElementsByTagName("img")[0];
			if (image) {
				var link = document.createElement("a");
				link.href = image.src
						.replace("img/thumb", "img/source")
						.replace(".png.jpg", ".png");
				image.parentNode.append(link);
				link.append(image);
			}
		}

		createSelectors(slideshow);
		
		var caption = document.createElement("div");
		caption.classList.toggle("caption");
		slideshow.appendChild(caption);
		slideshow.caption = caption;
	
		setCurrentSlide(slideFromIndex(slideshow, 0));
//		setTargetSlide(slideFromIndex(slideshow, 0));
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
			var index = m_slideshow.targetSlide.index;
			setTargetSlide(slideFromIndex(m_slideshow, index - 1));
		};
		selectors.appendChild(prev);

		for (var j = 0; j < slideshow.slides.length; j++) {
			var selector = document.createElement("a");
			selector.classList.toggle("selector");
			selector.index = j;
			selector.innerText = j;
			selector.onclick = function() {
				var m_slideshow = slideshow;
				var index = j;
				return function() {setTargetSlide(m_slideshow.slides[index]);};
			}();
			selectors.appendChild(selector);
		}

		var next = document.createElement("a");
		next.classList.toggle("next");
		next.classList.toggle("selector");
		next.innerHTML = "&#10095;";
		next.onclick = function() {
			var m_slideshow = slideshow;
			var index = m_slideshow.targetSlide.index;
			setTargetSlide(slideFromIndex(m_slideshow, index + 1));
		};
		selectors.appendChild(next);

		slideshow.appendChild(selectors);
		slideshow.selectors = selectors.getElementsByClassName("selector");
	}
});

// set the current slide, regardless of the target
// used to style the selectors and get the slide caption
function setCurrentSlide(slide) {
	// dynamically load image
	var image = slide.getElementsByTagName("img")[0];
	if (!! image) {
		loadImage(image, function(img) {
			img.style.filter = "unset";
		});
	}

	// update slideshow state
	var slideshow = slide.parentElement.parentElement;

	slideshow.caption.innerText = slide.dataset.caption;

	if (!slideshow.currentSlide) {
		slideshow.currentSlide = slide;
	}
	if (!slideshow.targetSlide) {
		slideshow.targetSlide = slide;
	}
	slideshow.selectors[slideshow.currentSlide.index+1].classList.remove("selectorActive");
	slideshow.currentSlide = slide;
	slideshow.selectors[slideshow.currentSlide.index+1].classList.add("selectorActive");
}

// set the slide to move to
function setTargetSlide(slide) {
	var slideshow = slide.parentElement.parentElement;

	if (slideshow.targetSlide && slideshow.targetSlide != slideshow.currentSlide) {
		slideshow.selectors[slideshow.targetSlide.index+1].classList.remove("selectorActive");
	}
	slideshow.targetSlide = slide;
	slideshow.selectors[slide.index+1].classList.add("selectorActive");

	scrollToSlide(slide);
}

function slideFromIndex(slideshow, index) {
	return slideshow.slides[mod(index, slideshow.slides.length)];
}

function mod(n, m) {
	return ((n % m) + m) % m;
}

function scrollToSlide(slide) {
	slide.scrollIntoView({
		behavior: "smooth",
		inline: "center",
		block: "nearest",
	});
}

function loadImage (image, fn) {
	var replacementSrc = image.src.replace("img/thumb", "img/400");
	if (image.width > 800) {
		replacementSrc = replacementSrc.replace("img/400", "img/800");
	}
	if (image.src == replacementSrc) {
		return;
	}

	var replacement = new Image();
	replacement.onload = function() {
		if (!! image.parent) {
			image.parent.replaceChild(replacement, image)
		} else {
			image.src = replacementSrc;
		}

		if (fn) {
			fn(image);
		}
	}
	replacement.src = replacementSrc;
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
	resizeTime = Date.now();
	var slideshows = document.getElementsByClassName("slideshow");
	for (let i = 0; i < slideshows.length; i++) {
		var slideshow = slideshows[i];
		var x = window.scrollX;
		var y = window.scrollY;
		slideshow.currentSlide.scrollIntoView({
			behavior: "auto",
			inline: "center",
			block: "nearest",
        });
		window.scrollTo(x, y);
	}
});
