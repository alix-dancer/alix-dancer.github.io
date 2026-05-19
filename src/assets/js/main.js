(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Hack: Enable IE workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Mobile?
		if (browser.mobile)
			$body.addClass('is-mobile');

	// Scrolly.
		$('.scrolly')
			.scrolly({
				offset: 100
			});

	// Polyfill: Object fit.
		if (!browser.canUse('object-fit')) {

			$('.image[data-position]').each(function() {

				var $this = $(this),
					$img = $this.children('img');

				// Apply img as background.
					$this
						.css('background-image', 'url("' + $img.attr('src') + '")')
						.css('background-position', $this.data('position'))
						.css('background-size', 'cover')
						.css('background-repeat', 'no-repeat');

				// Hide img.
					$img
						.css('opacity', '0');

			});

			$('.gallery > a').each(function() {

				var $this = $(this),
					$img = $this.children('img');

				// Apply img as background.
					$this
						.css('background-image', 'url("' + $img.attr('src') + '")')
						.css('background-position', 'center')
						.css('background-size', 'cover')
						.css('background-repeat', 'no-repeat');

				// Hide img.
					$img
						.css('opacity', '0');

			});

		}

	// Gallery state (keyboard / swipe navigation).
		var _galleryCurrentIndex = -1,
			_galleryCurrentLinks = null;

	// Gallery.
		$('.gallery')
			.on('click', 'a', function(event) {

				var $a = $(this),
					$gallery = $a.parents('.gallery'),
					$modal = $gallery.children('.modal'),
					$modalImg = $modal.find('img'),
					href = $a.attr('href');

				// Not an image? Bail.
					if (!href.match(/\.(jpg|gif|png|mp4)$/))
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Lock.
					$modal[0]._locked = true;

				// Track gallery position for keyboard / swipe navigation.
					_galleryCurrentLinks = $gallery.find('> a[href]');
					_galleryCurrentIndex = _galleryCurrentLinks.index($a);

				// Set src.
					$modalImg.attr('src', href);

				// Set visible.
					$modal.addClass('visible');

				// Focus.
					$modal.focus();

				// Delay.
					setTimeout(function() {

						// Unlock.
							$modal[0]._locked = false;

					}, 600);

			})
			.on('click', '.modal', function(event) {

				var $modal = $(this),
					$modalImg = $modal.find('img');

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Already hidden? Bail.
					if (!$modal.hasClass('visible'))
						return;

				// Stop propagation.
					event.stopPropagation();

				// Lock.
					$modal[0]._locked = true;

				// Clear visible, loaded.
					$modal
						.removeClass('loaded')

				// Delay.
					setTimeout(function() {

						$modal
							.removeClass('visible')

						setTimeout(function() {

							// Clear src.
								$modalImg.attr('src', '');

							// Unlock.
								$modal[0]._locked = false;

							// Focus.
								$body.focus();

						}, 475);

					}, 125);

			})
			.on('mouseup mousedown mousemove', '.modal', function(event) {

				// Stop propagation.
					event.stopPropagation();

			})
			.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
				.find('img')
					.on('load', function(event) {

						var $modalImg = $(this),
							$modal = $modalImg.parents('.modal');

						setTimeout(function() {

							// No longer visible? Bail.
								if (!$modal.hasClass('visible'))
									return;

							// Set loaded.
								$modal.addClass('loaded');

						}, 275);

					});

	// Gallery: keyboard navigation (arrows + Escape).
		$(document).on('keydown', function(event) {

			var $visibleModal = $('.gallery .modal.visible');
			if (!$visibleModal.length)
				return;

			// Escape – close.
			if (event.keyCode == 27) {
				$visibleModal.trigger('click');
				return;
			}

			// Left / Right – navigate.
			if (event.keyCode == 37 || event.keyCode == 39) {
				if (!_galleryCurrentLinks || _galleryCurrentLinks.length <= 1)
					return;

				event.preventDefault();

				if ($visibleModal[0]._locked)
					return;

				var delta = (event.keyCode == 39) ? 1 : -1;
				_galleryCurrentIndex = (_galleryCurrentIndex + delta + _galleryCurrentLinks.length) % _galleryCurrentLinks.length;

				var href = _galleryCurrentLinks.eq(_galleryCurrentIndex).attr('href');
				var $modalImg = $visibleModal.find('img');

				$visibleModal[0]._locked = true;
				$visibleModal.removeClass('loaded');
				$modalImg.attr('src', href);

				setTimeout(function() {
					$visibleModal[0]._locked = false;
				}, 400);
			}

		});

	// Gallery: touch swipe navigation.
		$(document)
			.on('touchstart', '.gallery .modal', function(event) {
				$(this).data('touchStartX', event.originalEvent.touches[0].clientX);
			})
			.on('touchend', '.gallery .modal', function(event) {

				var startX = $(this).data('touchStartX');
				if (startX === undefined)
					return;

				var diff = startX - event.originalEvent.changedTouches[0].clientX;
				if (Math.abs(diff) < 50 || !$(this).hasClass('visible'))
					return;

				if (!_galleryCurrentLinks || _galleryCurrentLinks.length <= 1)
					return;

				if ($(this)[0]._locked)
					return;

				var delta = diff > 0 ? 1 : -1;
				_galleryCurrentIndex = (_galleryCurrentIndex + delta + _galleryCurrentLinks.length) % _galleryCurrentLinks.length;

				var href = _galleryCurrentLinks.eq(_galleryCurrentIndex).attr('href');
				var $modal = $(this);
				var $modalImg = $modal.find('img');

				$modal[0]._locked = true;
				$modal.removeClass('loaded');
				$modalImg.attr('src', href);

				setTimeout(function() {
					$modal[0]._locked = false;
				}, 400);

			});

})(jQuery);