define([
], function (
	) {
	return function(SagaCollection){
		return {
		
			_prepareFetchOptions: function (options) {
				if (!options) options = {
					data: {}
				};
				if (!options.data) options.data = {};
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
				options = this._prepareFetchOptions(options);

				this._isLoading = true;

				var success = options.success;
				var error = options.error;

				var me = this;
				options.success = function(){
					success && success.apply(this, arguments);
					me.trigger("Fetch:success");
				}
				options.error = function(error){
					error && error.apply(this, arguments);
					me.trigger("Fetch:error", error);
				}

				var fetch = Backbone.Collection.prototype.fetch.apply(this, [options]);
				var me = this;
				fetch.always(function (data) {
					me._isLoading = false;
				});
				return fetch;
			},

		}

	}
});






