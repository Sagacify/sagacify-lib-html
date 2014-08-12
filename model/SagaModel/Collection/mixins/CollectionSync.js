define([
], function (
	) {
	return function(SagaCollection){
		return {
		
			_prepareFetchOptions: function (options) {
				options = _.defaults(options||{}, {
					data : {}
				});

				if (this._sort) {
					if (typeof this._sort == "string") {
						options.data.sort_by = this._sort;
					} else {
						options.data.sort_by = this._sort.keys()[0];
						options.data.sort_how = this._sort[options.data.sort_by];
					}
				}
				for (var key in this._filters) {
					//options.data[key] = JSON.stringify(this._filters[key]);
					options.data[key] = this._filters[key];
				}

				return options;
			},

			fetch: function (options) {
				options = _.defaults(options||{}, {
					paginate:false,
				})

				if (options.paginate) {
					options = this._preparePaginateFetchOptions(options);
				};

				options = this._prepareFetchOptions(options);

				this._isLoading = true;
				this.trigger('loading-start');

				var success = options.success;
				var error = options.error;

				var me = this;
				options.success = function(){
					success && success.apply(this, arguments);
					me.trigger("Fetch:success");
					me._isLoading = false;
					me.trigger('loading-stop');
				}

				options.error = function(error){
					if (error && error.apply) {
						error.apply(this, arguments);
					};
					
					me.trigger("Fetch:error", error);
					me._isLoading = false;
					me.trigger('loading-stop');
				}
				return  Backbone.Collection.prototype.fetch.apply(this, [options]);
			},

		}

	}
});
