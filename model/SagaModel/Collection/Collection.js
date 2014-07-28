define([
	'backbone',
	
	'./mixins/CollectionHelpers',
	'./mixins/CollectionPagination',
	'./mixins/CollectionSync',
	

], function (
	Backbone, 

	CollectionHelpers,
	CollectionPagination,
	CollectionSync

) {
	var SagaCollection = Backbone.Collection.extend({


		_isLoading: false,

		_sort: {
			//field: asc|desc
		},

		_filters: {

		},

		parent: {
			instance: null,
			path: null
		},


		constructor: function(attrs, options){
			this.removePaginate();

			if (options) {
				if (options.url) {
					this.url = options.url;
					
				}
				if (options.parent) {
					this.parent = options.parent;
				}
			}

			return Backbone.Collection.prototype.constructor.apply(this, arguments);
			this.updateUrl()
			this._handleCustomEvents();
		},


		_handleCustomEvents: function () {
			this.on('add', function () {
				var added = arguments[0];
				var me = this;
				this.listenTo(added, 'sync:destroy', function (res) {
					me.trigger('sync:remove');
				});
			});
		},		

		updateUrl: function(){
			if (this.parent.instance) {
				if (!this.parent.instance.id) {
					var me = this;
					this.listenTo(this.parent.instance, 'change:'+this.parent.instance.idAttribute, function(parentModel, parentIdentifier){
						var regeneratedUrl = parentModel.getUrlFor(me);
						me.url = regeneratedUrl||me.url;
						me.stopListening(this.parent.instance, 'change:'+this.parent.instance.idAttribute);
					})
				};
			};
		},




	});
	
	_.extend(SagaCollection.prototype, CollectionHelpers(SagaCollection));
	_.extend(SagaCollection.prototype, CollectionPagination(SagaCollection));
	_.extend(SagaCollection.prototype, CollectionSync(SagaCollection));

	return SagaCollection;
});