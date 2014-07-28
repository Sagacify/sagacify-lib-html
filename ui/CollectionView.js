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
			

			// search child
			var currentModel = itemView.model
			var previousChild = null;
			while(!previousChild){
				var currentModel = this.collection.previousModel(currentModel);
				if (!currentModel) {
					return null;
				};
				previousChild = this.children.findByModel(currentModel)
			}
			return previousChild;


			// if (previousModel && !this.children.findByModel(previousModel)) {
			// 	debugger
			// };
			// return previousModel && this.children.findByModel(previousModel);
		},

		nextChild: function(itemView){
			var nextModel = this.collection.nextModel(itemView.model);
			return nextModel && this.children.findByModelx(itemView.model);
		},


		showLoadingView: function(){
			this.closeEmptyView();
			var LoadingView = Backbone.Marionette.getOption(this, "loadingView");

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