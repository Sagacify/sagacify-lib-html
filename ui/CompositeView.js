define([
	'backbone.marionette',
	'./Mixin'
], function (Marionette, Mixin) {

	var CompositeView = Marionette.CompositeView.extend({

		constructor: function(){
			this.beforeConstructor();
			Marionette.CompositeView.prototype.constructor.apply(this, arguments);
		},

		render: function(){
			var elems = this.parseFirstElement();
			Marionette.CompositeView.prototype.render.apply(this, arguments);
			this.reinjectFirstElement(elems);
		}

	});

	_.extend(CompositeView.prototype, Mixin);

	return CompositeView;

});