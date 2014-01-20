define([
	'saga/types/validateType',
	'backbone.marionette'
], function (is) {

	var CompositeViewCopy = {
		constructor: Backbone.Marionette.CompositeView.prototype.constructor
	};

	_.extend(Backbone.Marionette.CompositeView.prototype, {

		constructor: function(options){
			return CompositeViewCopy.constructor.apply(this, arguments);
		}

	});
});