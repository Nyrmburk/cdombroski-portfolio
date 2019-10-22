JS ?= \
	js/digitsAI.js \
	js/feedforward.js \
	js/network.js \
	js/script.js \
	js/slideshow.js \

JPG ?= $(shell cd img/source && find -name "*.jpg")
PNG ?= $(shell cd img/source && find -name "*.png")
PNG_JPG ?= $(addsuffix .jpg, $(PNG))
IMG ?= $(JPG) $(PNG_JPG)

THUMB ?= $(addprefix img/thumb/,$(IMG))
400 ?= $(addprefix img/400/,$(IMG))
800 ?= $(addprefix img/800/,$(IMG))

.PHONY: website
website: index.html min.css js/min.js images

index.html: index_source.html  
	cp $< $@
	sed -i "s/href=\"style.css\"/href=\"min.css\"/g" $@
	sed -i "s/<script.*\/script>//g" $@
	sed -i "s/<!--min-script-placeholder-->/<script defer src=js\/min.js><\/script>/g" $@
	html-minifier \
	--collapse-whitespace \
	--conservative-collapse \
	--collapse-boolean-attributes \
	--collapse-inline-tag-whitespace \
	--remove-comments \
	--remove-empty-attributes \
	--remove-optional-tags \
	--remove-redundant-attributes \
	--remove-script-type-attributes \
	--remove-style-link-type-attributes \
	--remove-tag-whitespace \
	--use-short-doctype \
	-o $@ \
	$@

js/min.js: $(JS)
	@mkdir -p $(dir $@)
	uglifyjs -o $@ -c -m -- $^

min.css: style.css
	cleancss -O0 -o $@ $^

.PHONY: images
images: $(THUMB) $(400) $(800)

img/thumb/%.jpg: img/source/%.jpg
	@mkdir -p $(dir $@)
	convert $< -thumbnail 96 -quality 10 $@

img/thumb/%.png.jpg: img/source/%.png
	@mkdir -p $(dir $@)
	convert $< -thumbnail 96 -quality 10 $@

img/400/%.jpg: img/source/%.jpg
	@mkdir -p $(dir $@)
	convert $< -resize 400 -quality 90 $@

img/400/%.png.jpg: img/source/%.png
	@mkdir -p $(dir $@)
	convert $< -resize 400 -quality 90 $@

img/800/%.jpg: img/source/%.jpg
	@mkdir -p $(dir $@)
	convert $< -resize 800 -quality 95 $@

img/800/%.png.jpg: img/source/%.png
	@mkdir -p $(dir $@)
	convert $< -resize 800 -quality 95 $@

.PHONY: clean
clean:
	$(RM) index.html
	$(RM) js/min.js
	$(RM) min.css
	$(RM) -r img/thumb
	$(RM) -r img/400
	$(RM) -r img/800
