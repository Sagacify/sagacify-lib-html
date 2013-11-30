define([

], function () {

	return function GooglePlaces (getter_Lat, getter_Lng) {
		if(getter_Lat && getter_Lng) {
			this.lat = getter_Lat;

			this.lng = getter_Lng;

			this.earthRadius = 6371;

			this.radius = (30 * 1000) / this.earthRadius; // 20 Km

			// check how to calculate new lat / lng with radius
			this.lat_sw = this.lat() - (this.radius / 111);
			this.lng_sw = this.lng() - (this.radius / Math.abs(Math.cos((this.lat() / (Math.PI / 180)))) * 111);
			this.soutwestBound = new google.maps.LatLng(this.lat_sw, this.lng_sw);
			//this.soutwestBound = new google.maps.LatLng(this.lat() + this.radius, this.lng() - this.radius);

			// check how to calculate new lat / lng with radius
			this.lat_ne = this.lat() + (this.radius / 111);
			this.lng_ne = this.lng() + (this.radius / Math.abs(Math.cos((this.lat() / (Math.PI / 180)))) * 111);
			this.northeastBound = new google.maps.LatLng(this.lat_ne, this.lng_ne);
			//this.northeastBound = new google.maps.LatLng(this.lat() - this.radius, this.lng() + this.radius);

			this.bounds = new google.maps.LatLngBounds(this.soutwestBound, this.northeastBound);
		}

		this.set_Autocomplete = function (selectField) {
			var options = {
				types: ['geocode'],
				componentRestrictions: {
					country: ['be']
				}
			};
			this.bounds && (options.bounds = this.bounds);
			this.autocomplete = new google.maps.places.Autocomplete(selectField, options);
		};

		this.selected_location = null;

		this.get_SelectedLocation = function () {
			return (this.selected_location = this.autocomplete.getPlace());
		};

		this.set_Location = function(loc){
			this.selected_location = loc;
		}

		this.bind_Event = function (googleEvent, callback) {
			var me = this;
			google.maps.event.addListener(this.autocomplete, googleEvent, function () {
				callback(me.get_SelectedLocation());
			});
		};

		this.set_SelectLocationHandler = function (callback) {
			this.bind_Event('place_changed', callback);
		};

		this.get_LocationLatLng = function (loc) {
			var lat = loc.geometry.location.lat();
			var lng = loc.geometry.location.lng();
			return [lat, lng];
		};

		this.get_LocationAddress = function (loc) {
			return [
				(loc.address_components[0] && loc.address_components[0].short_name || ''),
				(loc.address_components[1] && loc.address_components[1].short_name || ''),
				(loc.address_components[2] && loc.address_components[2].short_name || '')
			].join(',');
		};

		this.get_LocationAddressComps = function (loc) {
			return loc.address_components.reduce(function (base, addresComp) {
				return (base[addresComp.types[0]] = addresComp.short_name) && (base);
			}, {});
		};

	};

});
