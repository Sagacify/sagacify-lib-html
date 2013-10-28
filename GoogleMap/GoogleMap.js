define([

], function () {

	return function GoogleMap (mapNode, lat, lng) {

		this.lat = lat;

		this.lng = lng;

		this.zoom = 10;

		this.center = function () {
			return new google.maps.LatLng(this.lat, this.lng);
		};

		this.results = [];

		this.markers = [];

		this.set_Marker = function () {
			this.markers.push({
				map: this.map,
				position: this.center()
			});		
			// for(var i = 0, len = this.results.length; i < len; i++) {
			// 	this.markers.push({
			// 		map: this.map,
			// 		position: this.results[0].geometry.location
			// 	});
			// }
		};

		this.set_latlng = function (lat, lng) {
			this.lat = lat;
			this.lng = lng;
			this.set_Marker(); // FOR TESTING ONLY
		};

		this.set_latlng_to_Location = function (location) {
			var lat = location.geometry.location.lat;
			var lng = location.geometry.location.lng;
			this.set_latlng(lat, lng); // FOR TESTING ONLY
		};

		this.map = new google.maps.Map(mapNode, {
			zoom				:	this.zoom,
			center				:	this.center(),
			mapTypeId			:	google.maps.MapTypeId.ROADMAP,
			scrollwheel			:	false,
			zoomControl			:	true,
			scaleControl		:	false,
			mapTypeControl		:	true,
			zoomControlOptions	:	{
				style			:	google.maps.ZoomControlStyle.SMALL
			}
		});

	};

});