define([

], function () {

	return function GoogleGeocoding (lat, lng) {

		this.radius = 20 * 1000; // 20 Km

		// check how to calculate new lat / lng with radius
		this.soutwestBound = (this.lat + this.radius) + ',' + (this.lng - this.radius);

		// check how to calculate new lat / lng with radius
		this.northeastBound = (this.lat - this.radius) + ',' + (this.lng + this.radius);

		this.bounds = (lat && lng) ? this.soutwestBound + '|' + this.northeastBound : null;

		this.geocoder = new google.maps.Geocoder();

		this.handleResponse = function (results, status, callback) {
			/**
			* indicates that no errors occurred;
			* the address was successfully parsed and at least one geocode was returned.
			*/
			if(status === google.maps.GeocoderStatus.OK) {
				callback(null, results);
			}
			/**
			* indicates that the geocode was successful but returned no results.
			* This may occur if the geocode was passed a non-existent address or a latlng in a remote location.
			*/
			else if(status === google.maps.GeocoderStatus.ZERO_RESULTS) {
				callback('No results. Please change your search keywords.');
			}
			/**
			* indicates that you are over your quota.
			*/
			else if(status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
				callback('There was an error. Please try again later.');
			}
			/**
			* indicates that your request was denied, generally because of lack of a sensor parameter.
			*/
			else if(status === google.maps.GeocoderStatus.REQUEST_DENIED) {
				callback('There was an error. Please try again alter.');
			}
			/**
			* generally indicates that the query (address or latlng) is missing.
			*/
			else if(status === google.maps.GeocoderStatus.INVALID_REQUEST) {
				callback('You have to specify an address before searching.');
			}
			/**
			* indicates that the request could not be processed due to a server error.
			* The request may succeed if you try again.
			*/
			else if(status === google.maps.GeocoderStatus.UNKNOWN_ERROR) {
				callback('There was an error. Please try again alter.');
			}
		};

		this.search_Address = function (address, callback) {
			var me = this;
			var parameters = {
				address: address,
				bounds: me.bounds
			};
			if(this.bounds) {
				parameters.bounds = this.bounds;
			}
			this.geocoder.geocode(parameters, function (results, status) {
				me.handleResponse(results, status, callback);
			});
		};

		this.reverseGeocoding = function(lat, lng, callback){
			var me = this;
			//var latLng = [lat, lng];
			var parameters = {
				latLng : new google.maps.LatLng(lat, lng)
			}

			this.geocoder.geocode(parameters, function (results, status) {
				console.log(results);
				console.log(status);
				me.handleResponse(results, status, callback);
			});
		};

	};

});
