define([

], function () {

	function freeCollections () {
		var properties = Object.keys(App);
		for(var i = 0, len = properties.length; i < len; i++) {
			if(App[properties[i]] instanceof Backbone.Collection) {
				App[properties[i]].reset();
			}
		}
	}

	function freeUser () {
		if(App.user instanceof Backbone.Model) {
			debugger
			App.user.clear();
		}
	}

	return {

		free: function  () {
			// Remove every collection instance
			freeCollections();
			freeUser();
		}

	};

});
