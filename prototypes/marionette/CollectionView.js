define([
	'saga/types/validateType',
	'backbone.marionette'
], function (is) {

	var CollectionViewCopy = {
		getItemView: Backbone.Marionette.CollectionView.prototype.getItemView
	};

	_.extend(Backbone.Marionette.CollectionView.prototype, {

		getItemView: function(item){
			return CollectionViewCopy.constructor.apply(this, arguments);
		}

	});
});