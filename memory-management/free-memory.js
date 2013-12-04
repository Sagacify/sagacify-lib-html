define([
	'saga/types/validateType'
], function (is) {

	function freeCollections () {
		if(is.Object(App.collections)) {
			var collectionNames = Object.keys(App.collections);
			for(var i = 0, len = collectionNames.length; i < len; i++) {
				if(App[collectionNames[i]] instanceof Backbone.Collection) {
					App[collectionNames[i]].reset();
				}
			}
		}
	}

	function freeUser () {
		App.user = null;
	}

	return function  () {
		// Remove every collection instance
		freeCollections();
		freeUser();
	};

});
