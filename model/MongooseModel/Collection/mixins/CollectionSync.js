define([
	'../../../../ajax/SGAjax',
], function (
SGAjax
	) {
	return function(SagaCollection){
		return {
			
			//deprecated, use json output format from schema... (Voir Yvan)
			setAsIds: function(){
				this.models.forEach(function(model){
					model._isId = true;
				});
			},	

			dummyFetch: function(options) {
				this._prepareFetchOptions(options);
				var url = typeof this.url == "function" ? this.url() : this.url;
				return SGAjax.ajax({
					type: 'GET',
					url: url,
					data: options.data
				});
			},

			// _prepareFetchOptions: function (options) {
			// 	if (!options) options = {
			// 		data: {}
			// 	};
			// 	if (!options.data) options.data = {};
			// 	if (this._sort) {
			// 		if (typeof this._sort == "string") {
			// 			options.data.sort_by = this._sort;
			// 		} else {
			// 			options.data.sort_by = this._sort.keys()[0];
			// 			options.data.sort_how = this._sort[options.data.sort_by];
			// 		}
			// 	}
			// 	for (var key in this._filters) {
			// 		//options.data[key] = JSON.stringify(this._filters[key]);
			// 		options.data[key] = this._filters[key];
			// 	}

			// 	return options;
			// },

			// fetch: function (options) {
			// 	options = this._prepareFetchOptions(options);

			// 	this._isLoading = true;

			// 	var success = options.success;
			// 	var error = options.error;

			// 	var me = this;
			// 	options.success = function(){
			// 		success && success.apply(this, arguments);
			// 		me.trigger("Fetch:success");
			// 	}
			// 	options.error = function(error){
			// 		error && error.apply(this, arguments);
			// 		me.trigger("Fetch:error", error);
			// 	}

			// 	var fetch = Backbone.Collection.prototype.fetch.apply(this, [options]);
			// 	var me = this;
			// 	fetch.always(function (data) {
			// 		me._isLoading = false;
			// 	});
			// 	return fetch;
			// },


			getAttr: function(attr){
				var url = this.url instanceof Function ? this.url() : this.url;
				return SGAjax.ajax({
					type: 'GET',
					url: url + '/' + attr
				});
			}, 


			JSONFromSchema: function(options){
				options = _.defaults(options||{}, {
					schemaFormat : undefined	
				})
				
				if (!options.schemaFormat) {
					return this.JSONFromSchema(this.mongooseSchema);
				};

				var res = [];
				var me = this;
				this.each(function(model){
					var c = options.schemaFormat.getContent();
					res.push(model.JSONFromSchema({schemaFormat:c}));
				});
				return res;
			}, 



		}

	}
});






