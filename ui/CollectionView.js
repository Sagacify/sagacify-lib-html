define([
	'backbone.marionette',
], function (Marionette) {

	// prototype the base Marionette CollectionView
	var CollectionView = Marionette.CollectionView.extend({

		collectionBind: false,

		get_Template: function (data, settings) {
			return this._template ? _.template(this._template, data, settings) : this.template;
		},

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