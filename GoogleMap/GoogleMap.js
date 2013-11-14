define([

], function () {

	return function GoogleMap (mapNode, lat, lng, ProfessionalMarkerTemplate, SearchMarkerTemplate) {

		this.lat = lat;

		this.lng = lng;

		this.zoom = 10;

		this.center = function () {
			return new google.maps.LatLng(this.lat, this.lng);
		};

		this.results = [];

		this.markers = [];

		this.infoboxes = [];

		this.searchMarkerTemplate = ProfessionalMarkerTemplate;

		this.proMarkerTemplate = SearchMarkerTemplate;

		this.set_Infobox = function (marker, type) {
			var template = (type === 'search') ? this.searchMarkerTemplate : this.proMarkerTemplate;
			var infobox = new google.maps.InfoWindow({
				content: template
			});
			this.infoboxes.push(infobox);

			var me = this;
			google.maps.event.addListener(infobox, 'domready', function () {
				$('.gm-style-iw').siblings('div').remove();
			});
			// google.maps.event.addListener(marker, 'click', function () {
			// 	infobox.open(this.map, marker);
			// });
			google.maps.event.addListener(marker, 'mouseover', function () {
				infobox.open(me.map, marker);
			});
			google.maps.event.addListener(marker, 'mouseout', function () {
				infobox.close();
			});
		};

		this.set_Marker = function () {
			var marker = new google.maps.Marker({
				map: this.map,
				position: this.center(),
				title: 'Your search'
			});
			this.markers.push(marker);
			this.set_Infobox(marker, 'search');
		};

		this.set_latlng = function (lat, lng) {
			this.lat = lat;
			this.lng = lng;
			this.map.setCenter(this.center());
			this.set_Marker();
		};

		this.set_latlng_to_Location = function (location) {
			var lat = location.geometry.location.lat();
			var lng = location.geometry.location.lng();
			this.set_latlng(lat, lng);
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