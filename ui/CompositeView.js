define([
	'backbone.marionette',
	'./Mixin'
], function (Marionette, Mixin) {

	var CompositeView = Marionette.CompositeView.extend({

		constructor: function(options){
			this.beforeConstructor(options);
			Marionette.CompositeView.prototype.constructor.apply(this, arguments);
		},

		render: function(){
			Marionette.CompositeView.prototype.render.apply(this, arguments);
			this._handleGoToAfterRender();
			this.reinjectFirstElement();
		}

	});

	_.extend(CompositeView.prototype, Mixin);

	return CompositeView;

});