define([
	'backbone.marionette',
	'./Mixin'
], function (Marionette, Mixin) {

	// prototype the base Marionette CollectionView
	var CollectionView = Marionette.CollectionView.extend({

		onBottomReached: null,

		bindEvent: function (widget, eventName, callback) {
			_.extend(widget, Backbone.Events);

			var me = this;
			widget.on(eventName, function () {
				callback.apply(me, arguments);
			});
		},

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
			this._handleFirstRender();
			Marionette.CollectionView.prototype.constructor.apply(this, arguments);
		},

		render: function(){
			Marionette.CollectionView.prototype.render.apply(this, arguments);
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
		}

	});

	_.extend(CollectionView.prototype, Mixin);

	return CollectionView;
});