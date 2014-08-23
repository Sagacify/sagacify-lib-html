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

		constructor: function (attrs, options) {
			this.removePaginate();
			this.resetSGSort();
			this.resetSGFilter();

			if (options) {
				if (options.url) {
					this.url = options.url;

				}
				if (options.parent) {
					this.parent = options.parent;
				}
			}

			var res = Backbone.Collection.prototype.constructor.apply(this, arguments);
			this.updateUrl();
			this._handleCustomEvents();
			return res;
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
						var parentUrl = typeof parentModel.url == 'string' ? parentModel.url : parentModel.url();
						me.url = parentUrl+'/'+me.parent.path;
					})
				}
			}
		},

	});

	_.extend(SagaCollection.prototype, CollectionHelpers(SagaCollection));
	_.extend(SagaCollection.prototype, CollectionPagination(SagaCollection));
	_.extend(SagaCollection.prototype, CollectionSync(SagaCollection));

	return SagaCollection;
});