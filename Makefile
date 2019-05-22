JS ?= \
	js/digitsAI.js \
	js/feedforward.js \
	js/network.js \
	js/script.js \
	js/slideshow.js \

index.html: index_source.html min.css js/min.js
	@mkdir -p $(dir $@)
	cp $< $@
	sed -i "s/href=\"style.css\"/href=\"min.css\"/g" $@
	sed -i "s/<script.*\/script>//g" $@
	sed -i "s/<!--min-script-placeholder-->/<script defer src=js\/min.js><\/script>/g" $@
	html-minifier \
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
	cleancss -O2 -o $@ $^

.PHONY: clean
clean:
	$(RM) index.html
	$(RM) js/min.js
	$(RM) min.css
