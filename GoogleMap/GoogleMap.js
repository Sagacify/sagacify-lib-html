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

		this.points = [];

		this.markers = [];

		this.infoboxes = [];

		this.displayed_infobox = null;

		this.set_Bounds = function () {
			var bounds = new google.maps.LatLngBounds();
			for(var i = 0, len = this.points.length; i < len; i++) {
				bounds.extend(this.points[i]);
			}
			this.map.fitBounds(bounds);
			var me = this;
			var zoom = -1;
			var mapzoom;
			var listener = google.maps.event.addListener(this.map, 'idle', function() {
				mapzoom = me.map.getZoom();
				zoom = (zoom === -1) ? mapzoom - 1 : mapzoom;
				me.map.setZoom(zoom || 1);
				me.map.fitBounds(bounds);
				google.maps.event.removeListener(listener);
			});
		};

		this.set_MarkerEventHandlers = function (infobox, marker) {
			var me = this;
			google.maps.event.addListener(infobox, 'domready', function () {
				$('.gm-style-iw').siblings('div').remove();
			});
			google.maps.event.addListener(marker, 'click', function () {
				infobox[infobox.getMap() ? 'close' : 'open'](me.map, marker);
				if(me.displayed_infobox && me.displayed_infobox !== infobox) {
					me.displayed_infobox.close();
				}
				me.displayed_infobox = infobox;
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
			var position;
			if(lat && lng) {
				position = this.new_LatLng(lat, lng);
				this.points.push(position);
				this.set_Bounds();
			}
			else {
				position = this.center();
			}
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

		this.clear_Markers = function () {
			for(var i = 0, len = this.markers.length; i < len; i++) {
				this.markers[i].setMap(null);
			}
			this.markers.length = 0;
		};

		this.clear = function () {
			this.displayed_infobox = null;
			this.infoboxes.length = 0;
			this.clear_Markers();
			this.points.length = 0;
		};

		this.resize = function () {
			google.maps.event.trigger(this.map, 'resize');
		};

		this.map = new google.maps.Map(mapNode, {
			zoom						:	this.zoom,
			center						:	this.center(),
			mapTypeId					:	google.maps.MapTypeId.ROADMAP,
			scrollwheel					:	false,
			scaleControl				:	false,
			// keyboardShortcuts		: 	false,
			// scaleControlOptions		:	{
			// 	position				:	google.maps.ControlPosition.RIGHT_BOTTOM
			// },
			panControl					:	false,
			// panControlOptions		:	{
			// 	position				:	google.maps.ControlPosition.RIGHT_BOTTOM
			// },
			zoomControl					:	true,
			zoomControlOptions			:	{
				style					:	google.maps.ZoomControlStyle.SMALL,
				position				:	google.maps.ControlPosition.LEFT_BOTTOM
			},
			mapTypeControl				:	true,
			mapTypeControlOptions		:	{
				position				:	google.maps.ControlPosition.RIGHT_BOTTOM
			},
			streetViewControl			:	false,
			// streetViewControlOptions	:	{
			// 	position				:	google.maps.ControlPosition.RIGHT_BOTTOM
			// },
			overviewMapControl			:	true
			// overviewMapControlOptions:	{
			// 	position				:	google.maps.ControlPosition.LEFT_BOTTOM
			// },
		});

	};

});