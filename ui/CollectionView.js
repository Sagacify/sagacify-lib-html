define([
	'backbone.marionette',
], function (Marionette) {

	var CollectionView = Marionette.CollectionView.extend({
		// prototype the base Marionette CollectionView

		collectionBind: false,

		render: function(){
			Marionette.CollectionView.prototype.render.apply(this, arguments);
			this.bindToCollection();
		},

		bindToCollection: function(){
			if(this.collectionBind && this.collection){
				var me = this;
				this.collection.on('add remove', function(args){
					me.render();
				});
			}
		}
	});

	return CollectionView;
});