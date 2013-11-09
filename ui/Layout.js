define([
	'backbone.marionette',
	'./Mixin',
	'./ModelBindMixin'
], function (Marionette, Mixin, ModelBindMixin) {

	// prototype of the base Marionette Layout
	var Layout = Marionette.Layout.extend({

		constructor: function(){
			this._handleFirstRender();
			this.model = this.getModel();
			Marionette.Layout.prototype.constructor.apply(this, arguments);
		},

		bindEvent: function (widget, eventName, callback) {
			_.extend(widget, Backbone.Events);

			var me = this;
			widget.on(eventName, function () {
				callback.apply(me, arguments);
			});
		},

		render: function(){
			this.template = this.get_Template(this.model);
			Marionette.Layout.prototype.render.apply(this, arguments);
			this.bindToModel();
		},

		appear: function (node) {
			$(node).show();
		},

		disappear: function (node) {
			$(node).hide();
		},

		toggle: function (node) {
			$(node).toggle();
		},

		getModel: function(){
			return null;
		}

	});

	_.extend(Layout.prototype, Mixin, ModelBindMixin);

	return Layout;
});