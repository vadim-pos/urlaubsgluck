'use strict';

// ---------- Slider ----------

$.fn.slider = function(options) {
	
	var _self = this;
	//DOM Nodes
	var sliderNode     = this,
		slidesWrap     = sliderNode.find('.slider__wrap'),
		slides         = slidesWrap.find('.slider__slides'),
		prevSlideLink  = sliderNode.find('.slider__prev'),
		nextSlideLink  = sliderNode.find('.slider__next'),
		pagination     = sliderNode.find('.slider__pagination');
	// Other variables
	var currentSlideIndex = options.currentSlide || 0,
		slideDuration     = options.duration || 0.3,
		slidesCount       = slides.children().length,
		slideSize         = slidesWrap[(options.slideStyle === 'vertical') ? 'outerHeight' : 'outerWidth'](),
		autoSlideDelay    = options.delay || false,
		timer;

	this.prevSlide = function() {
		if (currentSlideIndex === 0) {
			currentSlideIndex = slidesCount - 1;
			return;
		}
		currentSlideIndex--;	
	};

	this.nextSlide = function() {
		if (currentSlideIndex === slidesCount - 1) {
			currentSlideIndex = 0;
			return;
		}
		currentSlideIndex++;
	};

	this.createPagination = function() { // add list items and links to pagination list
		if (!pagination.length) { return; }  // only if pagination is needed

		var fragment = $(document.createDocumentFragment());

		for (var i = 0; i < slidesCount; i++) {
			var pagItem = $(document.createElement('li'));
			pagItem.addClass(options.pagItemClass);

			var pagLink = $(document.createElement('a'));
			pagLink.addClass(options.pagLinkClass);
			pagLink.attr('data-slide', i);

			pagItem.append(pagLink);
			fragment.append(pagItem);
		}
		pagination.append(fragment);
		pagination.children().eq(currentSlideIndex).find('a').addClass('active');
	};

	this.render = function() {
		var margin = (options.slideStyle === 'vertical') ? 'margin-top' : 'margin-left';
		slides.css(margin, (-currentSlideIndex * slideSize));

		if (pagination.length) {
			pagination.find('.active').removeClass('active');
			pagination.children().eq(currentSlideIndex).find('a').addClass('active');
		}
	};

	this.setupListeners = function() {
		if (prevSlideLink) {
			prevSlideLink.on('click', function (e) {
				e.preventDefault();
				_self.prevSlide();
				_self.render();
				clearInterval(timer);
			});
		}
		if (nextSlideLink) {
			nextSlideLink.on('click', function (e) {
				e.preventDefault();
				_self.nextSlide();
				_self.render();
				clearInterval(timer);
			});
		}
		if(pagination) {
			pagination.on('click', function(e) {
				e.preventDefault();
				var target = $(e.target);
				if (target.prop("tagName") !== 'A') { return; }

				clearInterval(timer);
				currentSlideIndex = +target.data('slide');
				_self.render();	
			});
		}
		$(window).on('resize', function() {
			slideSize = slidesWrap[(options.slideStyle === 'vertical') ? 'outerHeight' : 'outerWidth']();
			_self.render();
		});		
	};

	this.autoSlide = function() {
		if (autoSlideDelay) {
			timer = setInterval(function() {
				_self.nextSlide();
				_self.render();	
			}, autoSlideDelay);
		}
	}

	this.init = function() {
		slides.css('transition', ('margin ' + slideDuration + 's' + ' ease'));
		this.createPagination();
		if (options.slideStyle === 'vertical') {
			slides.css('white-space', 'normal');
		}
		this.setupListeners();
		this.render();
		this.autoSlide();
	}

	this.init();
}
// ------------- END Slider -------------


$('.intro__slider').each(function() {
	$(this).slider({
		slideStyle: 'horizontal',
		'duration': 0.4
	});
});


// ---------- Module for setting background images ----------

(function() {
		var activityList  = $('.activity__list'),
			activityItems = activityList.find('.activity__item'),
			slidersWrap   = $('.intro__sliders-wrap'),
			slides        = slidersWrap.find('.intro__slider-item');

		setBGImages(activityItems);
		setBGImages(slides);

	function setBGImages(items) {
		items.each(function() {
			var $this = $(this);
			var backgroundProp = 'url(img/' + $this.data('image') + ') center center';

			$this.css({
				'background': backgroundProp,
				'background-size': 'cover'
			});
		});
	}
}());