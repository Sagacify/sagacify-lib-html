define([

], function () {

	return function GooglePlaces (getter_Lat, getter_Lng) {
		if(getter_Lat && getter_Lng) {
			this.lat = getter_Lat;

			this.lng = getter_Lng;

			this.radius = 20 * 1000; // 20 Km

			// check how to calculate new lat / lng with radius
			this.soutwestBound = new google.maps.LatLng(this.lat() + this.radius, this.lng() - this.radius);

			// check how to calculate new lat / lng with radius
			this.northeastBound = new google.maps.LatLng(this.lat() - this.radius, this.lng() + this.radius);

			this.bounds = new google.maps.LatLngBounds(this.soutwestBound, this.northeastBound);
		}

		this.set_Autocomplete = function (selectField) {
			var options = {
				types: ['geocode']
			};
			this.bounds && (options.bounds = options.bounds);
			this.autocomplete = new google.maps.places.Autocomplete(selectField, options);
		};

		this.selected_location = null;

		this.get_SelectedLocation = function () {
			return (this.selected_location = this.autocomplete.getPlace());
		};

		this.bind_Event = function (googleEvent, callback) {
			var me = this;
			google.maps.event.addListener(this.autocomplete, googleEvent, function () {
				callback(me.get_SelectedLocation());
			});
		};

		this.set_SelectLocationHandler = function (callback) {
			this.bind_Event('place_changed', callback);
		};

	};

});
