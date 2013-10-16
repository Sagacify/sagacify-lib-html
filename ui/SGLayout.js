define([
	'backbone.marionette',
], function (Marionette) {

	// prototype of the base Marionette Layout
	var SGLayout = Marionette.Layout.extend({

		bindEvent: function (widget, eventName, callback) {
			_.extend(widget, Backbone.Events);

			var me = this;
			widget.on(eventName, function () {
				callback.apply(me, arguments);
			});
		},

		appear: function (node) {
			$(node).show();
		},

		disappear: function (node) {
			$(node).hide();
		},

	});

	return SGLayout;
});