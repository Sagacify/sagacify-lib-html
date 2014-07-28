define([
	'saga/types/validateType',
	'backbone.marionette'
], function (is) {

	var CollectionViewCopy = {
		constructor: Backbone.Marionette.CollectionView.prototype.constructor,
		getItemView: Backbone.Marionette.CollectionView.prototype.getItemView,
		render: Backbone.Marionette.CollectionView.prototype.render
	};

	_.extend(Backbone.Marionette.CollectionView.prototype, {

		constructor: function(options){
			return CollectionViewCopy.constructor.apply(this, arguments);
		},

		onBottomReached: null,

		_prepareCollection: function(){
			this.collection = this.getCollection();
			if(this.collection){
				if (!this.collection.sgSort) {
					debugger
				};
				this.collection.sgSort(this.sort).sgFilter(this.filters).sgPaginate(this.paginate);
			}
		},

		_handleBottomReached: function(){
			if(this.onBottomReached){
				var me = this;
				this.listenTo(App, 'bottomReached', function(){
					me.onBottomReached();
				});
			}
		},

		_handleOptions: function(options){
			this.options = options||{};
			for(var key in options){
				if(key in this){
					this[key] = options[key];
				}
			}
		},

		beforeConstructor: function(options){
			this._handleOptions(options);
			this._prepareCollection();
			this._handleBottomReached();
			this._handleFirstRender();
			this._handleGoTo();
		},

		getCollection: function(){
			return null;
		},

		nextPage: function(){
			if(this.collection && !this.collection.isMaxReached() && !this.collection.isLoading()){
				// this.showLoadingView();
				var me = this;
				var def = this.collection.nextPage();
				def.always(function(){
					me.isProcessingNextPage = false;
					// me.closeLoadingView();
				});
				return def;
			}
		},

		// showLoadingView: function(){
		// 	this.closeEmptyView();
		// 	var LoadingView = Backbone.Marionette.getOption(this, "loadingView");

		// 	if(LoadingView && !this._loadingView){
		// 		var model = new Backbone.Model();
		// 		this.addItemView(model, LoadingView);
		// 		this._loadingView = this.children.last();
		// 	}
		// },

		// closeLoadingView: function(){
		// 	if (this._loadingView){
		// 		this.removeChildView(this._loadingView);
		// 		delete this._loadingView;
		// 	}
		// }

	});
});