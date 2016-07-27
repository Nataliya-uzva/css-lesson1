function Range(options) {

	var self = this,
			element = options.element,
			pointer = element.querySelector('.pointer');

	var value = {
		max: (options.maxValue = typeof options.maxValue == 'number' ? options.maxValue : 100),
		min: (options.minValue = typeof options.minValue == 'number' ? options.minValue : 0)
	};

	var boundingClientRect = {
		range: 	{},
		pointer: 	{}
	};
	var offset = {
		x: 0,
		y: 0
	};
	var EVENTS = Object.create(null);
	Object.defineProperties(EVENTS, {
		'slide':	{	value: 'slide'	},
		'change':	{	value: 'change'	}
	});

	var scaleInterval = (element.clientWidth - pointer.clientWidth) / value.max;

	this.options = options;
	this.setValue = function(value) {
		pointer.style.left = getPosition(value) + 'px';
		self.value = value;

		var ev = getCustomEvent(EVENTS.change);
		element.dispatchEvent(ev);
	};

	if (typeof options.onSlide == 'function') {
		element.addEventListener(EVENTS.slide, options.onSlide);
	}
	if (typeof options.onChange == 'function') {
		element.addEventListener(EVENTS.change, options.onChange);
	}
	if (typeof options.onStart == 'function') {
		var handler = function(event) {
			options.onStart(event);
			element.removeEventListener(EVENTS.change, handler);
		};
		element.addEventListener(EVENTS.change, handler);
	}


	/* prevent browser default d'n'd */
	element.ondragstart = function(event) {
		event.preventDefault();
		event.stopPropagation();
	};

	element.onmousedown = function(event) {

		boundingClientRect.range = element.getBoundingClientRect();
		boundingClientRect.pointer = pointer.getBoundingClientRect();

		offset.x = event.clientX - boundingClientRect.pointer.left;
		offset.y = event.clientY - boundingClientRect.pointer.top;

		document.addEventListener('mousemove', move);
		document.addEventListener('mouseup', stopMove);
	};

	function move(event) {
		var left = event.clientX - offset.x - boundingClientRect.range.left,
			leftBorder = 0,
			rightBorder = element.offsetWidth - pointer.offsetWidth;


		left = (left < leftBorder) ? leftBorder : (left > rightBorder) ? rightBorder : left;

		pointer.style.left = left + 'px';

		self.value = getValue(left);

		var ev = getCustomEvent(EVENTS.slide);
		element.dispatchEvent(ev);
	}

	function getPosition(value) {
		return scaleInterval * value;
	}

	function getValue(position) {
		/* round ? */
		return Math.floor(position / scaleInterval);
	}

	function getCustomEvent(type) {
		type = type || EVENTS.slide;
		var params = {
			bubbles: true,
			detail: self.value
		};

		return new CustomEvent(type, params);
	}

	function stopMove() {
		document.removeEventListener('mousemove', move);
		document.removeEventListener('mouseup', stopMove);

		self.value = getValue(parseInt(pointer.style.left));

		var ev = getCustomEvent(EVENTS.change);
		element.dispatchEvent(ev);
	}

}