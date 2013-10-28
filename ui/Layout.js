define([
	'backbone.marionette',
], function (Marionette) {

	// prototype of the base Marionette Layout
	var Layout = Marionette.Layout.extend({

		get_Template: function (data, settings) {
			return this._template ? _.template(this._template, data, settings) : this.template;
		},

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
		}

	});

	return Layout;
});