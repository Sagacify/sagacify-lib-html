define([
	'backbone.marionette',
	'./Mixin'
], function (Marionette, Mixin) {

	var CollectionView = Marionette.CollectionView.extend({

		constructor: function(options){
			this.beforeConstructor(options);
			Marionette.CollectionView.prototype.constructor.apply(this, arguments);
		},

		render: function(){
			Marionette.CollectionView.prototype.render.apply(this, arguments);
			if (this.elCssClass) {
				this.$el.addClass(this.elCssClass);
			};
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

	_.extend(CollectionView.prototype, Mixin);

	return CollectionView;
});