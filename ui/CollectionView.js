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
		}


	});

	_.extend(CollectionView.prototype, Mixin);

	return CollectionView;
});