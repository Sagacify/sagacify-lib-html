define([
	'async!https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&sensor=false&key=AIzaSyBmesWBpbDz7zQHq9xK-jGdmgkZqbZQ3z8'
], function () {

	return function GoogleMap (mapNode, base_lat, base_lng) {

		this.zoom = 10;

		this.new_LatLng = function (lat, lng) {
			return new google.maps.LatLng(lat, lng);
		};

		this.center = function () {
			return this.new_LatLng(this.lat || base_lat, this.lng || base_lng);
		};

		this.markers = [];

		this.infoboxes = [];

		this.set_MarkerEventHandlers = function (infobox, marker) {
			var me = this;
			google.maps.event.addListener(infobox, 'domready', function () {
				$('.gm-style-iw').siblings('div').remove();
			});
			google.maps.event.addListener(marker, 'click', function () {
				infobox[infobox.getMap() ? 'close' : 'open'](me.map, marker);
			});
			// google.maps.event.addListener(marker, 'mouseover', function () {
			// 	infobox.open(me.map, marker);
			// });
		};

		this.set_Infobox = function (marker, template) {
			var infobox = new google.maps.InfoWindow({
				content: template
			});
			this.infoboxes.push(infobox);
			this.set_MarkerEventHandlers(infobox, marker);
		};

		this.set_Marker = function (lat, lng, template) {
			var position = (lat && lng) && this.new_LatLng(lat, lng) || this.center();
			var marker = new google.maps.Marker({
				map: this.map,
				position: position,
				title: 'Your search'
			});
			this.markers.push(marker);
			template && this.set_Infobox(marker, template);
		};

		this.set_Center = function (lat, lng) {
			var center = this.new_LatLng(lat, lng) || this.center();
			this.map.setCenter(center);
		};

		this.get_Center = function () {
			return this.map.getCenter();
		};

		this.get_Lat = function () {
			return this.get_Center().lat();
		};

		this.get_Lng = function () {
			return this.get_Center().lng();
		};

		this.get_PositionLatLng = function (pos) {
			var lat = pos.coords.latitude;
			var lng = pos.coords.longitude;
			return [lat, lng];
		};

		this.map = new google.maps.Map(mapNode, {
			zoom				:	this.zoom,
			center				:	this.center(),
			mapTypeId			:	google.maps.MapTypeId.ROADMAP,
			scrollwheel			:	false,
			zoomControl			:	true,
			scaleControl		:	false,
			mapTypeControl		:	true,
			panControl			: 	false,
			zoomControlOptions	:	{
				style			:	google.maps.ZoomControlStyle.SMALL,
				position 		: 	google.maps.ControlPosition.LEFT_BOTTOM
			},
			mapTypeControlOptions: 	{
				position 		: 	google.maps.ControlPosition.RIGHT_BOTTOM
			}
		});

	};

});