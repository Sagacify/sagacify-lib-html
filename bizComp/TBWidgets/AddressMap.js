define([
	'dojo/_base/declare',
	'../_Widget', 
	'dojo/Evented', 
	'dojo/text!./templates/AddressMap.html', 
	'dojo/dom-attr',
	'./Dropdown',
	'dojo/_base/connect',
	'dojo/_base/xhr',
	'dojo/on'
	], 
	function(declare, _Widget, Evented, template, domAttr, Dropdown, connect, xhr, on) {

	return declare('BizComp.OpeningHourForm', [_Widget, Evented], {

		templateString: template,
		
		constructor: function(args){
					
		},
		
		postCreate: function() {
			var me = this;
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode( {"address": "Brussels"}, function(results, status) {
				var lat = results[0].geometry.location.lat();
				var lng = results[0].geometry.location.lng();
				var map = new google.maps.Map(me.mapNode, {
	  				center: new google.maps.LatLng(lat, lng),
	  				zoom: 7,
	  				mapTypeId: google.maps.MapTypeId.ROADMAP,
				});
				
				var marker = new google.maps.Marker({	
					map: map,
					draggable: true,
					visible: false
				});
				google.maps.event.addListener(marker, 'dragend', function (event) {
				    var lat = this.getPosition().lat();
				    var long = this.getPosition().lng();
				    
				    geocoder.geocode( {'location': new google.maps.LatLng(lat, long)}, function(results, status) {
						me.addressNode.value = results[0].formatted_address;
						var tz = new TimeZoneDB;
				        tz.getJSON({
				            key: "5LM2TNRL0W55",
				            lat: lat,
				            lng: lng
				        }, function(data){
							me.emit("addressChange", {address:results[0], latLng:{lat:lat, lng:lng}, timeZone:data.gmtOffset/3600});
				        });
					});
				});
				
				var bounds = new google.maps.LatLngBounds(
					  new google.maps.LatLng(lat, lng),
					  new google.maps.LatLng(lat, lng)
				);
				
				var autocomplete = new google.maps.places.Autocomplete(me.addressNode, {bounds: bounds, types: ['geocode']});
				google.maps.event.addListener(autocomplete, "place_changed", function(args){
					geocoder.geocode( {'address': autocomplete.getPlace().formatted_address}, function(results, status) {
						if(results[0]){
							var lat = results[0].geometry.location.lat();
							var lng = results[0].geometry.location.lng();
							if(!marker.getVisible()) {
								marker.setVisible(true);
							}
							marker.setPosition(new google.maps.LatLng(lat, lng));
							map.setCenter(new google.maps.LatLng(lat, lng));
							map.setZoom(17);
							var tz = new TimeZoneDB;
					        tz.getJSON({
					            key: "5LM2TNRL0W55",
					            lat: lat,
					            lng: lng
					        }, function(data){
								me.emit("addressChange", {address:results[0], latLng:{lat:lat, lng:lng}, timeZone:data.gmtOffset/3600});
					        });
						}
					});
				});	
			});
		},
		
	});
});




