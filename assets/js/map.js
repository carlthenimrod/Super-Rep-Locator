$(function(){

	var srep = (function(){

		// Private Vars
		//////////////////////
		var map,
			$locator = $('#sr-locator'),
			$selectMenu,
			$countryMenu,
			$locationMenu,
			selectedCountry = false,
			selectedLocation = false,
			loading = false,
			markers = [],
			countries = false,
			locations = false,
			reps = false;

		// Intialize
		//////////////////////
		var init = function(){

			//ajax on load, retrieve all db records
			$.ajax({

				'url' : 'reps/all'
			})
			.done(function(data){

				//store info
				countries = data.countries;
				locations = data.locations;
				reps      = data.reps;
				
				//create map, center on USA
				map = new google.maps.Map(document.getElementById("sr-map"), {

					center: new google.maps.LatLng(38.555474, -95.664999),
					zoom: 4,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				});

				//create selectMenu
				createSelectMenu();

				//create Markers
				createMarkers();
			});
		};

		// Private Functions
		//////////////////////
		var createSelectMenu = function(){

			var $label;

			//create select menu
			$selectMenu = $('<section />', { class: 'sr-select-menu' });

			//create label
			$label = $('<section />', { class: 'sr-select-label '})
			.html('Select a Location: ');

			//append label to select menu
			$selectMenu.append( $label );

			//create sub menus
			createCountryMenu();
			createLocationMenu();

			//append select menu to locator
			$locator.append( $selectMenu );
		};

		var createCountryMenu = function(){

			var select,
				option,
				i, l;

			//create country menu
			$countryMenu = $('<section />', { class: 'sr-select-country' });

			//create country dropdown
			select = $('<select />', { class: 'sr-countries' });

			//for each country create an option
			for(i = 0, l = countries.length; i < l; ++i){

				//create option
				option = $('<option />', {
					html: countries[i].long_name,
					value: countries[i].id
				});

				//add as selected if US
				if( parseInt(countries[i].id, 10) === 1 ){

					option.attr('selected', 'selected');

					selectedCountry = 1;

					//make top option
					select.prepend(option);
				}
				else{

					//append option to select element
					select.append(option);
				}
			}

			//bind event
			select.on('change', countryChange);

			//append select to country menu
			$countryMenu.append( select );

			//append country menu to container
			$selectMenu.append( $countryMenu );

			//initialize chosen plugin
			select.chosen({ 
				disable_search_threshold: 10,
				width: '200px'
			});
		};

		var countryChange = function(){

			var id = $(this).find(':selected').val(),
				coords,
				i, l;

			//for each country find selected
			for(i = 0, l = countries.length; i < l; ++i){

				//if match
				if( countries[i].id === id ){

					//change selected
					selectedCountry = parseInt( countries[i].id, 10 );

					//update location menu
					updateLocationMenu();

					//store coords
					coords = new google.maps.LatLng(countries[i].lat, countries[i].lng);

					//update map
					map.setCenter( coords );
					map.setZoom( 4 );

					//clear markers
					clearMarkers();

					//create markers
					createMarkers();

					break;
				}
			}
		};

		var createLocationMenu = function(){

			var selected = [],
				select,
				option,
				i, l, x, y;

			//create location menu
			$locationMenu = $('<section />', { class: 'sr-select-location' });

			//for each location create an option
			for(i = 0, l = locations.length; i < l; ++i){

				//skip if not correct id
				if( locations[i].country_id != selectedCountry ) continue;

				//add to selected array
				selected.push( locations[i] );
			}

			//if we have locations selected, create menu
			if( selected.length > 1 ){

				//create location dropdown
				select = $('<select />', { class: 'sr-locations' });

				//for each selected
				for(x = 0, y = selected.length; x < y; ++x){

					//create option
					option = $('<option />', {
						html: selected[x].long_name,
						value: selected[x].id
					});

					//append option to select element
					select.append(option);
				}

				//create default option
				option = $('<option />', {
					html: '--- Select a Location ---',
					value: '0'
				})
				.prependTo( select );

				//bind event
				select.on('change', locationChange);

				//append select to location menu
				$locationMenu.append( select );

				//append location menu to container
				$selectMenu.append( $locationMenu );

				//initialize chosen plugin
				select.chosen({ 
					disable_search_threshold: 10,
					width: '300px'
				});
			}
		};

		var updateLocationMenu = function(){

			var selected = [],
				select,
				option,
				i, l, x, l;

			//remove existing menu
			$locationMenu.empty();

			//no location selected
			selectedLocation = false;

			//for each location create an option
			for(i = 0, l = locations.length; i < l; ++i){

				//skip if not correct id
				if( locations[i].country_id != selectedCountry ) continue;

				//add to selected array
				selected.push( locations[i] );
			}

			//if we have locations selected, create menu
			if( selected.length > 1 ){

				//create location dropdown
				select = $('<select />', { class: 'sr-locations' });

				//for each selected
				for(x = 0, y = selected.length; x < y; ++x){

					//create option
					option = $('<option />', {
						html: selected[x].long_name,
						value: selected[x].id
					});

					//append option to select element
					select.append(option);
				}

				//create default option
				option = $('<option />', {
					html: '--- Select a Location ---',
					value: '0'
				})
				.prependTo( select );

				//bind event
				select.on('change', locationChange);

				//append select to location menu
				$locationMenu.append( select );

				//append location menu to container
				$selectMenu.append( $locationMenu );

				//initialize chosen plugin
				select.chosen({ 
					disable_search_threshold: 10,
					width: '300px'
				});
			}
		};

		var locationChange = function(){

			var id = $(this).find(':selected').val();

			//for each location find selected
			for(i = 0, l = locations.length; i < l; ++i){

				//if match
				if( locations[i].id === id ){

					//change selected
					selectedLocation = parseInt( locations[i].id, 10 );

					//store coords
					coords = new google.maps.LatLng(locations[i].lat, locations[i].lng);

					//update map
					map.setCenter( coords );
					map.setZoom( 6 );

					//clear markers
					clearMarkers();

					//create markers
					createMarkers(true);

					break;
				}
			}
		};

		var createMarkers = function(animate){

			var coords,
				marker,
				i, l;

			//find if we need to animate
			animate = typeof animate !== 'undefined' ? true : false;

			for(i = 0, l = reps.length; i < l; ++i){

				if( selectedCountry ){ //if country is selected

					//make sure country id matches
					if( reps[i].country_id != selectedCountry ) continue;
				}

				if( selectedLocation ){ //if location is selected

					//make sure location id matches
					if( reps[i].location_id != selectedLocation ) continue;
				}

				//store location
				coords = new google.maps.LatLng(reps[i].lat, reps[i].lng);

				//add animation if option is set
				if(animate){

					//create marker
					marker = new google.maps.Marker({
	    				animation: google.maps.Animation.DROP,
						map: map,
						position: coords
					});
				}
				else{

					//create marker
					marker = new google.maps.Marker({
						map: map,
						position: coords
					});
				}

				//set attributes
				marker.attr = {

					'id' : reps[i].id,
					'name' : reps[i].name.trim,
					'address' : reps[i].address.trim,
					'state' : reps[i].state.trim,
					'city' : reps[i].city.trim,
					'zip' : reps[i].zip.trim,
					'company' : reps[i].company.trim,
					'phone' : reps[i].phone.trim,
					'fax' : reps[i].fax.trim,
					'email' : reps[i].email.trim,
					'web' : reps[i].web.trim,
					'lat' : reps[i].lat,
					'lng' : reps[i].lng
				}

				//add click event
				google.maps.event.addListener(marker, 'click', markerClick);

				//add to markers array
				markers.push(marker);
			}
		};

		var clearMarkers = function(){

			var i, l;

			//for each marker
			for(i = 0, l = markers.length; i < l; ++i){

				//remove
				markers[i].setMap(null);
			}

			//set markers as empty
			markers = [];
		}

		var markerClick = function(){

		};

		return{

			init: init
		}
	})();

	//start map
	srep.init();
});