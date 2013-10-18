define([
	'backbone.marionette',
], function (Marionette) {

	// prototype the base Marionette ItemView
	var SGItemView = Marionette.ItemView.extend({

		get_Template: function (data, settings) {
			return this._template ? _.template(this._template, data, settings) : this.template;
		}

	});

	return SGItemView;
});