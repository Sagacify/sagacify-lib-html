define([
	'backbone.marionette',
	'./Mixin'
], function (Marionette, Mixin) {

	var CollectionView = Marionette.CollectionView.extend({

		constructor: function(){
			this.beforeConstructor();
			Marionette.CollectionView.prototype.constructor.apply(this, arguments);
		},

		render: function(){
			Marionette.CollectionView.prototype.render.apply(this, arguments);
		}

	});

	_.extend(CollectionView.prototype, Mixin);

	return CollectionView;
});