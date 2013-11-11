define([
	'backbone.marionette'
], function (Marionette) {

	return Marionette.Region.extend({

		constructor: function(){
			Marionette.Region.prototype.constructor.apply(this, arguments);
		}

	});
});