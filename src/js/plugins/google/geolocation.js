(function ($) {
	var triggeredLc = true;
	var plugin = {};

	$.fn.loadApi = function () {
		console.log('Google API callback loadApi called');
		if (triggeredLc) {
			console.log('loadApi not yet triggered');
			triggeredLc = false;
			if (plugin.$form.length > 0) {
				console.log('calling initGp');
				plugin.$form.trigger("initGp");
			} else {
				console.log(plugin);
			}
		}
	}

	$.fn.geoCodePlaces = function (options) {

		var settings = $.extend({
			'debug': false,
			'apiKey': '',
			'prefix': '',
			'address': '',
			'city': '',
			'province': '',
			'zip': '',
			'country': '',
			'language': 'en',
			'shortProvince': false,
			'force_country': false
		}, options);

		plugin = $(this);
		plugin.$form = $(this).closest("form");
		var $input = $(this);

		debug("== Starting jquery geoCodePlaces plugin " + settings.address + ' ===');

		function debug(obj) {
			if (settings.debug && window.console && window.console.log) {
				window.console.log(obj);
			}
		};

		function initializeAutocomplete(id) {
			debug('initializeAutocomplete(' + id + ')');
			var element = document.getElementById(id);
			if (element) {
				if (settings.address) {
					debug('full mode');
					var gmp_options = { types: ['geocode'] };
				} else {
					debug('zip mode');
					var gmp_options = { types: ['(regions)'] };
				}
				debug(gmp_options);
				if (settings.force_country) {
					gmp_options['componentRestrictions'] = { country: settings.force_country };
				}
				debug(gmp_options);
				var autocomplete = new google.maps.places.Autocomplete(element, gmp_options);
				google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);
			}
		}

		function onPlaceChanged() {
			var place = this.getPlace();

            // Uncomment below line to view the full object returned by Google API.
			console.log(place);  

			if (typeof place !== "undefined" && typeof place.address_components !== "undefined") {
				sNumber = "",
				street = "",
					address = "",
					city = "",
					zip = "",
					province = "",
					level_1 = "",
					country = "";
				country_long_name = "";

				for (var i = 0; i < place.address_components.length; i++) {

					var object = place.address_components[i],
						type = object.types[0];

					if (type == "administrative_area_level_4") street = object.long_name;
					if (type == "street_number") sNumber = object.long_name;
					if (type == "route") address = object.long_name;
					if (type == "locality") city = object.long_name;
					if (type == "administrative_area_level_3") city = object.long_name;
					if (type == "administrative_area_level_2") province = object;
					if (type == "postal_code") zip = object.long_name;
					if (type == "administrative_area_level_1") level_1 = object;
					if (type == "country") country = object.short_name;
					if (type == "country") country_long_name = object.long_name;

				}
				/* US exception */
				province = (country == "US") ? level_1 : province;

				/* long name or short name for province? */
				province = settings.shortProvince || country == "US" ? province.short_name : province.long_name;

				/* fill inputs */
				var countryElement = $(settings.prefix + settings.country);
				countryElement.find("[data-country-code='" + country + "']").prop('selected', true);
				countryElement.trigger("change");

				setTimeout(function () {
					$(settings.prefix + settings.address).val((street != '' ? street + ", " : "") + sNumber + " " + address);
					$(settings.prefix + settings.city).val(city != null && city != '' ? city : level_1.long_name);
					if (country == "US") {
						var provinceElement = $(settings.prefix + settings.province);
						provinceElement.val(province);
					} else {
						$(settings.prefix + settings.province).val(province);
					}
					
					$(settings.prefix + settings.zip).val(zip);
				}, 500);
				return false;
			}
		}

		function setup() {
			debug("== setup called");
			debug("setting autocomplete on  " + $input.attr('id'));
			
			window.addEventListener('load', () => {
				initializeAutocomplete($input.attr('id'));
			});
		
		}

		function init() {
			debug("getScript function missed.");
			if (typeof $.getScript !== "function") {
				debug("+ getScript function missed.");
				return;
			} else {
				debug("+ getScript function exist.");
			}
			if (typeof google === "undefined" || typeof google.maps === "undefined" || typeof google.maps.places === "undefined") {
				debug("+ Google API is not loaded");
				debug('+ https://maps.googleapis.com/maps/api/js?libraries=places&language=' + settings.language + '&callback=$.fn.loadApi' + "&key=...");
				$.getScript('https://maps.googleapis.com/maps/api/js?libraries=places&language=' + settings.language + '&callback=$.fn.loadApi' + "&key=" + settings.apiKey);
				debug('+ setting initGp on $form do call setup');
				plugin.$form.one("initGp", setup);
			} else {
				setup();
			}
		}
		init();

		return this;
	};
}(jQuery));