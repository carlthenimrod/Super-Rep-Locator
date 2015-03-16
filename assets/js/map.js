$(function(){

	var srep = (function(){

		// Private Vars
		//////////////////////
		var map,
			infoWindow,
			$locator = $('#sr-locator'),
			$info = $('#sr-reps-info'),
			$selectMenu,
			$countryMenu,
			$locationMenu,
			selectedCountry = false,
			selectedLocation = false,
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

				//create info window	
				infoWindow = new google.maps.InfoWindow();

				//create selectMenu
				createSelectMenu();

				//create reps
				createReps();

				//create event for info box
				$info.on('mouseenter', '.sr-rep', markerBounce);
				$info.on('mouseleave', '.sr-rep', markerBounceStop);
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

					selectedCountry = countries[i];

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
					selectedCountry = countries[i];

					//update location menu
					updateLocationMenu();

					//store coords
					coords = new google.maps.LatLng(countries[i].lat, countries[i].lng);

					//update map
					map.setCenter( coords );
					map.setZoom( 4 );

					//clear reps
					clearReps();

					//create reps
					createReps();

					//close info window
					infoWindow.close();

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
				if( locations[i].country_id != selectedCountry.id ) continue;

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
					selected: 'selected',
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
				if( locations[i].country_id != selectedCountry.id ) continue;

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
					selected: 'selected',
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
					selectedLocation = locations[i];

					//store coords
					coords = new google.maps.LatLng(locations[i].lat, locations[i].lng);

					//update map
					map.setCenter( coords );
					map.setZoom( 6 );

					//clear reps
					clearReps();

					//create reps
					createReps(true);

					break;
				}
			}

			//close info window
			infoWindow.close();
		};

		var createReps = function(animate){

			var $rep,
				coords,
				marker,
				markerCount,
				h2,
				html = '',
				i, l;

			//find if we need to animate
			animate = typeof animate !== 'undefined' ? true : false;

			for(i = 0, l = reps.length; i < l; ++i){

				if( selectedCountry ){ //if country is selected

					//make sure country id matches
					if( reps[i].country_id != selectedCountry.id ) continue;
				}

				if( selectedLocation ){ //if location is selected

					//make sure location id matches
					if( reps[i].location_id != selectedLocation.id ) continue;
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

				//parse rep
				$rep = parseText( reps[i] );

				$info.append( $rep.clone() );

				//set attributes
				marker.attr = {

					id : reps[i].id,
					content : $rep,
					lat : reps[i].lat,
					lng : reps[i].lng
				}

				//add click event
				google.maps.event.addListener(marker, 'click', markerClick);

				//add to markers array
				markers.push(marker);
			}

			//if there are reps
			if( markers.length > 0 ){

				//create h2
				h2 = $('<h2 />');

				//create inner html
				if( selectedLocation ) html = selectedLocation.long_name + ', ';
				if( selectedCountry ) html += selectedCountry.long_name + ' - ';

				html += markers.length + ' Reps Located';

				//store html
				h2.html(html);

				//prepend h2
				$info.prepend(h2);
			}
		};

		var clearReps = function(){

			var i, l;

			//for each marker
			for(i = 0, l = markers.length; i < l; ++i){

				//remove
				markers[i].setMap(null);
			}

			//empty info window
			$info.empty();

			//set markers as empty
			markers.length = 0;
		}

		var markerClick = function(){

			//stop any running animations
			markerBounceStop();

			//if any content
			if( this.attr.content.html().trim() ){

				//add content to info window
				infoWindow.setContent( this.attr.content[0] );

				//open info window
				infoWindow.open(map, this);
			}
		};

		var markerBounce = function(){

			var id = $(this).attr('id'),
				i, l;

			for(i = 0, l = markers.length; i < l; ++i){

				if(markers[i].attr.id === id){

					markers[i].setAnimation( google.maps.Animation.BOUNCE );
				}
				else{

					markers[i].setAnimation( null );
				}
			}
		};

		var markerBounceStop = function(){

			var i, l;

			for(i = 0, l = markers.length; i < l; ++i){

				markers[i].setAnimation( null );
			}
		};

		var parseText = function(rep){

			var $content,
				name,
				company,
				email,
				address,
				city,
				state,
				zip,
				phone,
				fax,
				web;

			//create div
			$content = $('<div />', { 
				class: 'sr-rep',
				id: rep.id
			});

			//create shorthand names
			name    = rep.name.trim();
			company = rep.company.trim();
			email   = rep.email.trim();
			address = rep.address.trim();
			city    = rep.city.trim();
			state   = rep.state.trim();
			zip     = rep.zip.trim();
			phone   = rep.phone.trim();
			fax     = rep.fax.trim();
			web     = rep.web.trim();

			//parse text
			if( name ) 
				$content.append( parseName( name ) );
			if( company ) 
				$content.append( parseCompany( company ) );
			if( email ) 
				$content.append( parseEmail( email ) );
			if( address ) 
				$content.append( parseAddress( address ) );
			if( city || state || zip )
				$content.append( parseAddress2( city, state, zip ) );
			if( phone ) 
				$content.append( parsePhone( phone ) );
			if( fax ) 
				$content.append( parseFax( fax ) );
			if( web ) 
				$content.append( parseWeb( web ) );

			return $content;
		};

		var parseName = function(name){

			return $('<div />').html(name);
		};

		var parseCompany = function(company){

			return $('<div />').html(company);
		};

		var parseEmail = function(email){

			var link;

			link = $('<a />',{

				href: 'mailto:' + email
			});

			return $('<div />').html('Email: ' + link);
		};

		var parseAddress = function(address){

			return $('<div />').html(address);
		};

		var parseAddress2 = function(city, state, zip){

			var text = '';

			//text for various combinations of city, state, and/or zip
			if(city && state){

				text = city + ', ' + state;

				if(zip){

					text += ' ' + zip;
				}
			}
			else if(city || state){

				if(city && zip){ 

					text = city + ', ' + zip;
				}
				else if(city && !zip){

					text = city;
				}
				else if(state && zip){

					text = state + ', ' + zip;
				}
				else{

					text = state;
				}
			}
			else{

				text = zip;
			}

			return $('<div />').html(text);
		};

		var parsePhone = function(phone){

			var link;

			link = $('<a />',{

				href: 'mailto:' + phone
			})
			.html(phone);

			return $('<div />').append( 'Phone: ', link );
		};

		var parseFax = function(fax){

			return $('<div />').html('Fax: ' + fax);
		};

		var parseWeb = function(web){

			var link;

			link = $('<a />',{

				href: web
			})
			.html(web);

			return $('<div />').append( link );
		};

		return{

			init: init
		}
	})();

	//start map
	if( $('#sr-map').length > 0 ) srep.init(); 
});