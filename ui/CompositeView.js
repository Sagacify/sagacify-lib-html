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
		},

		previousChild: function(itemView){
			var previousModel = this.collection.previousModel(itemView.model);
			return previousModel && this.children.findByModel(previousModel);
		},

		nextChild: function(itemView){
			var nextModel = this.collection.nextModel(itemView.model);
			return nextModel && this.children.findByModelx(itemView.model);
		}
		

	});

	_.extend(CompositeView.prototype, Mixin);

	return CompositeView;

});