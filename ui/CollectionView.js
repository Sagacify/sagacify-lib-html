define([
	'backbone.marionette',
	'./Mixin'
], function (Marionette, Mixin) {

	// prototype the base Marionette CollectionView
	var CollectionView = Marionette.CollectionView.extend({

		onBottomReached: null,

		_prepareCollection: function(){
			this.collection = this.getCollection();
			if(this.collection)
				this.collection.sgSort(this.sort).sgFilter(this.filters).sgPaginate(this.paginate);
		},

		_handleBottomReached: function(){
			if(this.onBottomReached){
				var me = this;
				this.listenTo(App, 'bottomReached', function(){
					me.onBottomReached();
				});
			}
		},

		constructor: function(){
			this._prepareCollection();
			this._handleBottomReached();
			this._handleFirstRender();
			Marionette.CollectionView.prototype.constructor.apply(this, arguments);
		},

		render: function(){
			var elems = this.parseFirstElement();

			Marionette.CollectionView.prototype.render.apply(this, arguments);

			this.reinjectFirstElement(elems);
		},

		getCollection: function(){
			return null;
		},

		nextPage: function(){
			if(this.collection && !this.collection.isMaxReached() && !this.collection.isLoading()){
				this.showLoadingView();
				var me = this;
				this.collection.nextPage().always(function(){
					me.closeLoadingView();
				});
			}
		},

		showLoadingView: function(){
			this.closeEmptyView();
			var LoadingView = Marionette.getOption(this, "loadingView");

			if(LoadingView && !this._loadingView){
				var model = new Backbone.Model();
				this.addItemView(model, LoadingView);
				this._loadingView = this.children.last();
			}
		},

		closeLoadingView: function(){
			if (this._loadingView){
				this.removeChildView(this._loadingView);
				delete this._loadingView;
			}
		},

		close: function(){
			Marionette.CollectionView.prototype.close.apply(this, arguments);
		}

	});

	_.extend(CollectionView.prototype, Mixin);

	return CollectionView;
});