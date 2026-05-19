/**
 * Enhancements: scroll-reveal animations & side navigation.
 */
(function () {
	'use strict';

	// ─── Scroll-reveal ────────────────────────────────────────────────────────
	var revealTargets = [
		'#first > header',
		'#first > .content',
		'#second > header',
		'#second > .content',
		'#third > header',
		'#third > .content > section > header',
		'#third > .content > section > .content',
		'#fourth > header',
		'#fourth > .content',
	].join(',');

	var revealObserver = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-revealed');
				revealObserver.unobserve(entry.target);
			}
		});
	}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

	// Wait until page load animations complete before wiring up observers.
	window.addEventListener('load', function () {
		setTimeout(function () {
			document.querySelectorAll(revealTargets).forEach(function (el) {
				// Skip elements already in the viewport – don't animate them in.
				var rect = el.getBoundingClientRect();
				if (rect.top < window.innerHeight && rect.bottom > 0) return;

				el.classList.add('reveal');
				revealObserver.observe(el);
			});
		}, 200);
	});

	// ─── Side navigation ──────────────────────────────────────────────────────
	var navDefs = [
		{ selector: '#wrapper > section.intro', label: 'Accueil',      href: '#wrapper' },
		{ selector: '#first',                   label: 'Présentation', href: '#first'   },
		{ selector: '#second',                  label: 'Formations',   href: '#second'  },
		{ selector: '#third',                   label: 'Expériences',  href: '#third'   },
		{ selector: '#fourth',                  label: 'Contact',      href: '#fourth'  },
	];

	var nav = document.createElement('nav');
	nav.id = 'side-nav';
	nav.setAttribute('aria-label', 'Navigation rapide');

	var dotLinks = [];
	navDefs.forEach(function (def) {
		var a = document.createElement('a');
		a.href = def.href;
		a.setAttribute('aria-label', def.label);
		a.setAttribute('data-label', def.label);
		a.appendChild(document.createElement('span'));
		nav.appendChild(a);
		dotLinks.push(a);
	});

	document.body.appendChild(nav);

	// Smooth-scroll on dot click.
	dotLinks.forEach(function (a) {
		a.addEventListener('click', function (e) {
			e.preventDefault();
			var target = document.querySelector(a.getAttribute('href'));
			if (target) target.scrollIntoView({ behavior: 'smooth' });
		});
	});

	// Track active section using scroll position.
	var sectionEls = navDefs.map(function (def) {
		return document.querySelector(def.selector);
	});

	var currentActive = 0;
	dotLinks[0].classList.add('is-active');
	dotLinks[0].setAttribute('aria-current', 'true');

	function updateNav() {
		var scrollMid = window.pageYOffset + window.innerHeight * 0.5;
		var best = 0;
		sectionEls.forEach(function (el, i) {
			if (el && el.offsetTop <= scrollMid) best = i;
		});
		if (best !== currentActive) {
			dotLinks[currentActive].classList.remove('is-active');
			dotLinks[currentActive].removeAttribute('aria-current');
			dotLinks[best].classList.add('is-active');
			dotLinks[best].setAttribute('aria-current', 'true');
			currentActive = best;
		}
	}

	var scrollTicking = false;
	window.addEventListener('scroll', function () {
		if (!scrollTicking) {
			requestAnimationFrame(function () {
				updateNav();
				scrollTicking = false;
			});
			scrollTicking = true;
		}
	}, { passive: true });

	updateNav();
})();
