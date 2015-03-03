//on ready
$(function(){

	var map,
		geocoder,
		activeMarker = false,
		infoBoxHeight = false,
		loading = false,
		markers = [],
		timeout = false,
		pinImage;

	//create active pin image
	pinImage = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_map_pin_icon_withshadow&chld=star|00EE00",
		new google.maps.Size(40, 37),
		new google.maps.Point(0,0),
		new google.maps.Point(10, 34)
	);

	//ajax on load, retrieve all db records
	$.ajax({

		'url' : 'reps/all'
	})
	.done(function(data){

		var i, l, location, marker;

		//create geocoder
		geocoder = new google.maps.Geocoder();
		
		//create map, center on USA
		map = new google.maps.Map(document.getElementById("sr-map"), {

			center: new google.maps.LatLng(38.555474, -95.664999),
			zoom: 4,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		//for each record
		for(i = 0, l = data.length; i < l; ++i){

			location = new google.maps.LatLng(data[i].lat, data[i].lng);

			//create marker
			marker = new google.maps.Marker({
				map: map,
				position: location
			});

			//set attributes
			marker.attr = {

				'id' : data[i].id,
				'name' : data[i].name,
				'address' : data[i].address,
				'state' : data[i].state,
				'city' : data[i].city,
				'zip' : data[i].zip,
				'company' : data[i].company,
				'phone' : data[i].phone,
				'fax' : data[i].fax,
				'email' : data[i].email,
				'web' : data[i].web,
				'lat' : data[i].lat,
				'lng' : data[i].lng
			}

			//add click event
			google.maps.event.addListener(marker, 'click', markerClick);

			//add to markers array
			markers.push(marker);
		}
	});

	//FUNCTIONS
	markerClick = function(){

		//show info box, pass attributes
		showInfoBox(this.attr);

		//if no marker attributes, just remove altogether
		if(!activeMarker.attr && activeMarker) activeMarker.setMap(null);

		//if active marker is saved, set default image
		if(activeMarker.attr) activeMarker.setIcon(null);

		//this is active marker now
		activeMarker = this;

		//set active marker icon to active
		activeMarker.setIcon(pinImage);
	};

	showInfoBox = function(obj){

		var editBox = $('.sr-edit-info'),
			children = editBox.children();

		//clear inputs
		editBox.find('input').val('');

		//fill in values if provided
		if(obj.name) editBox.find('#sr-name').val(obj.name);
		if(obj.address) editBox.find('#sr-address').val(obj.address);
		if(obj.city) editBox.find('#sr-city').val(obj.city);
		if(obj.state) editBox.find('#sr-state').val(obj.state);
		if(obj.zip) editBox.find('#sr-zip').val(obj.zip);
		if(obj.company) editBox.find('#sr-company').val(obj.company);
		if(obj.phone) editBox.find('#sr-phone').val(obj.phone);
		if(obj.fax) editBox.find('#sr-fax').val(obj.fax);
		if(obj.email) editBox.find('#sr-email').val(obj.email);
		if(obj.web) editBox.find('#sr-web').val(obj.web);
		if(obj.id) editBox.find('#sr-id').val(obj.id);

		//if id is set, set save var to 1 else 0, indicates to update and not create new record
		(obj.id) ? editBox.find('#sr-save').val(0) : editBox.find('#sr-save').val(1);

		//if editBox is open, just return
		if(editBox.css('display') === 'block') return;

		//set height
		if(!infoBoxHeight) infoBoxHeight = editBox.css('height');

		//set height to zero
		editBox.css({
			'display': 'block',
			'height' : '0px'
		});

		//set children opacity to zero
		children.css({
			'opacity' : '0'
		});

		editBox.animate({
			'height' : infoBoxHeight
		}, 100, function(){

			children.animate({
				'opacity' : '1'
			}, 200);
		});
	};

	hideInfoBox = function(){

		var editBox = $('.sr-edit-info'),
			children = editBox.children();

		if(editBox.css('display') !== 'block') return;

		children.animate({'opacity' : '0'}, 50);

		editBox.animate({'height' : 0}, 50, function(){

			$(this).css('display', 'none');
		});
	};

	showErrorMessage = function(msg){

		var ctn = $('.sr-msg');

		ctn.css('display', 'block');

		ctn.html('Error: ' + msg);

		if(timeout) window.clearTimeout(timeout);

		timeout = window.setTimeout(function(){

			ctn.fadeOut(100);
			timeout = false;
		}, 2000);
	};

	//EVENTS
	$('form.sr-search').on('submit', function(e){

		e.preventDefault();

		var address = $(this).find('input#sr-address').val(),
			city = $(this).find('input#sr-city').val(),
			state = $(this).find('input#sr-state').val(),
			zip = $(this).find('input#sr-zip').val(),
			full_address = '',
			obj;

		//create full_address
		if(address) full_address += address + ' ';
		if(city) full_address += city;
		if(state || zip) full_address += ', '
		if(state) full_address += state + ' ';
		if(zip) full_address += zip;

		//set icon back to default
		if(activeMarker) activeMarker.setIcon(null);

		//if new marker exists, remove
		if(!activeMarker.attr && activeMarker) activeMarker.setMap(null);

		//get lat/lng of full_address
		geocoder.geocode({'address' : full_address}, function(results, status){
			console.log(results);
			if(status == google.maps.GeocoderStatus.OK){

				//set map and zoom to marker location
				map.setCenter(results[0].geometry.location);
				map.setZoom(4);
				
				//create marker
				activeMarker = new google.maps.Marker({
					draggable: true,
					map: map,
					position: results[0].geometry.location,
					icon: pinImage
				});

				//create obj with form values
				obj = {

					'address' : address,
					'state' : state,
					'city' : city,
					'zip' : zip
				};

				//show info box, send form values
				showInfoBox(obj);
			}
			else if(status == google.maps.GeocoderStatus.ZERO_RESULTS){

				$('.sr-edit-info').hide();

				showErrorMessage('No Results Found.');
			}
			else if(status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){

				$('.sr-edit-info').hide();
				
				showErrorMessage('Over Query Limit, Try Again Later.');
			}
			else if(status == google.maps.GeocoderStatus.REQUEST_DENIED){

				$('.sr-edit-info').hide();
				
				showErrorMessage('Request Denied.');
			}
			else if(status == google.maps.GeocoderStatus.INVALID_REQUEST){

				$('.sr-edit-info').hide();
				
				showErrorMessage('Invalid Request');
			}
			else{

				$('.sr-edit-info').hide();

				showErrorMessage('Unknown Error, Contact Administrator');
			}
		});
	});

	$('form.sr-info').on('submit', function(e){

		var name = $(this).find('input#sr-name').val(),
			address = $(this).find('input#sr-address').val(),
			city = $(this).find('input#sr-city').val(),
			state = $(this).find('input#sr-state').val(),
			zip = $(this).find('input#sr-zip').val(),
			company = $(this).find('input#sr-company').val(),
			phone = $(this).find('input#sr-phone').val(),
			fax = $(this).find('input#sr-fax').val(),
			email = $(this).find('input#sr-email').val(),
			web = $(this).find('input#sr-web').val(),
			id = $(this).find('input#sr-id').val(),
			lat,
			lng,
			save = $(this).find('input#sr-save').val(),
			data,
			marker;

		e.preventDefault();

		//set lat/lng
		lat = activeMarker.position.lat();
		lng = activeMarker.position.lng();

		data = {
			'name' : name,
			'address' : address,
			'state' : state,
			'city' : city,
			'zip' : zip,
			'company' : company,
			'phone' : phone,
			'fax' : fax,
			'email' : email,
			'web' : web,
			'lat' : lat,
			'lng' : lng,
			'save' : save
		};

		//set id if present
		if(id) data.id = id;

		if(loading) return;

		//now loading
		loading = true;
		$('.sr-loading').css('display', 'block');

		//do ajax
		$.ajax({

			'data' : data,
			'dataType' : 'json',
			'type' : 'POST',
			'url' : '/gmap/reps/save/'

		}).then(function(data){

			//hide edit window
			$('.sr-edit-info').css('display', 'none');

			//if no attribute are set, add to marker array
			if(!activeMarker.attr){

				marker = activeMarker;

				activeMarker = false;

				marker.attr = {

					'id' : data.id,
					'name' : data.name,
					'address' : data.address,
					'state' : data.state,
					'city' : data.city,
					'zip' : data.zip,
					'company' : data.company,
					'phone' : data.phone,
					'fax' : data.fax,
					'email' : data.email,
					'web' : data.web,
					'lat' : data.lat,
					'lng' : data.lng
				}

				marker.setIcon(null);

				google.maps.event.addListener(marker, 'click', markerClick);

				markers.push(marker);

				//not loading
				loading = false;
				$('.sr-loading').css('display', 'none');
			}
			else{

				marker = activeMarker;

				activeMarker = false;

				marker.setIcon(null);

				//remove and replace marker
				if(marker != -1) {

					markers.splice(marker, 1);

					marker.attr = {

						'id' : data.id,
						'name' : data.name,
						'address' : data.address,
						'state' : data.state,
						'city' : data.city,
						'zip' : data.zip,
						'company' : data.company,
						'phone' : data.phone,
						'fax' : data.fax,
						'email' : data.email,
						'web' : data.web,
						'lat' : data.lat,
						'lng' : data.lng
					}

					markers.push(marker);

					//not loading
					loading = false;
					$('.sr-loading').css('display', 'none');
				}
			}
		}, function(){

			//not loading
			loading = false;
			$('.sr-loading').css('display', 'none');

			showErrorMessage('Unable to Save, Try Again and Contact Administrator if Problem Persists.');
		});
	});

	$('.sr-delete').on('click', function(){

		var data;

		if(loading) return;

		if(confirm('DELETE: Are you sure?')){

			if(!activeMarker.attr && activeMarker){

				//remove marker
				activeMarker.setMap(null);

				//clear inputs, hide edit window
				$('.sr-edit-info').hide().find('input').val('');				
			}
			else if(activeMarker.attr){

				//now loading
				loading = true;
				$('.sr-loading').css('display', 'block');

				//create data to send
				data = { id: activeMarker.attr.id };

				//do ajax, remove from DB
				$.ajax({

					'data' : data,
					'dataType' : 'json',
					'type' : 'POST',
					'url' : '/gmap/reps/delete/'

				}).then(function(data){

					//if deleted successfully, remove marker
					if(data.success){

						//hide edit window
						$('.sr-edit-info').css('display', 'none');

						//remove marker
						activeMarker.setMap(null);
					}

					//not loading
					loading = false;
					$('.sr-loading').css('display', 'none');

				}, function(){

					//not loading
					loading = false;
					$('.sr-loading').css('display', 'none');

					//show error message
					showErrorMessage('Cannot Delete, Try Again and Contact Administrator if Problem Persists.');
				});		
			}
		}
	});

	$('.sr-hide').on('click', hideInfoBox);
});