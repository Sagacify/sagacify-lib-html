define([

], function () {

	return function GoogleMap (mapNode, lat, lng, center) {

		this.lat = lat;

		this.lng = lng;

		this.zoom = 10;

		this.radius = 20 * 1000; // 20 Km

		this.soutwestBound = this.lat + this.radius; // check how to calculate new lat / lng with radius

		this.northeastBound = this.lng + this.radius; // check how to calculate new lat / lng with radius

		this.bounds = new google.maps.LatLngBounds(this.soutwestBound, this.northeastBound);

		this.center = new google.maps.LatLng(lat, lng);

		this.markers = [];

		this.geocoder = new google.maps.Geocoder();

		this.set_Marker = function set_Marker () {
			var marker;
			for(var i = 0, len = this.results.length; i < len; i++) {
				marker = new google.maps.Marker({
					map: this.map,
					bounds: this.bounds,
					position: this.results[0].geometry.location
				});
				this.markers.push(marker);
			}
		};

		this.search_Address	= function search_Address (address, callback) {
			this.geocoder.geocode({
				address: address
			}, function (results, status) {
				if(status === google.maps.GeocoderStatus.OK) {
					callback(results);
				}
				else {
					callback(true);
				}
			});
		};

		this.map = new google.maps.Map(mapNode, {
			zoom: this.zoom,
			center: this.center,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

	};

});