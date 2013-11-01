define([
	'backbone.marionette',
], function (Marionette) {

	// prototype the base Marionette CollectionView
	var CollectionView = Marionette.CollectionView.extend({

		//collectionBind: false,

		onBottomReached: null,

		_prepareCollection: function(){
			this.collection = this.getCollection();
			if(this.collection)
				this.collection.sort(this.sort).filter(this.filters).paginate(this.paginate);
		},

		_handleBottomReached: function(){
			if(this.onBottomReached){
				var me = this;
				App.on('bottomReached', function(){
					me.onBottomReached();
				});
			}
		},

		constructor: function(){
			this._prepareCollection();
			this._handleBottomReached();
			Marionette.CollectionView.prototype.constructor.apply(this, arguments);
		},

		get_Template: function (data, settings) {
			return this._template ? _.template(this._template, data, settings) : this.template;
		},

		render: function(){
			Marionette.CollectionView.prototype.render.apply(this, arguments);
		},

		// bindToCollection: function(){
		// 	if(this.collectionBind && this.collection){
		// 		var me = this;
		// 		this.collection.on('set', function(args){
		// 			console.log('onset')
		// 			me.render();
		// 		});
		// 	}
		// },

		getCollection: function(){
			return null;
		},

		nextPage: function(){
			if(this.collection && !this.collection.isMaxReached() && !this.collection.isLoading()){
				this.collection.nextPage();
			}
		}

	});

	return CollectionView;
});