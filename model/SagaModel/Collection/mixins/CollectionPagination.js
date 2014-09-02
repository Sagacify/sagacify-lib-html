define([
	
], function () {
	return function(SagaCollection){
		return {


			//Interdit, au niveau des classes. Le pointer _paginate sera toujours le même!
			_paginate: {
				currentPage: 0,
				// which page should pagination start from
				perPage: 0,
				// how many items per page should be shown (0 is no limit)
				maxPages: 0,
				// max pages (0 is not limit) 
				_maxPagesReached: false,
				// fill intervals with "dummy" models (useful for grids)
				dummyModels: false,
			},

			isMaxReached: function () {
				return this._paginate._maxPagesReached;
			},


			removePaginate: function(){
				this._paginate = {
					currentPage: 0,
					// which page should pagination start from
					perPage: 0,
					// how many items per page should be shown (0 is no limit)
					maxPages: 0,
					// max pages (0 is not limit) 
					_maxPagesReached: false
				};
			},

			resetPaginate: function(){
				this._paginate.currentPage = 0;
				this._paginate._maxPagesReached = false;
				this._pagesAlreadyFetched = null;
			},

			sgPaginate: function (paginate) {
				_.extend(this._paginate, paginate);
				return this;
			},		

			_preparePaginateFetchOptions: function (options) {
				options = _.defaults(options||{}, {
					data: {},
					first: null,
					remove: false, 
					success: null
				});

				if (this._paginate.perPage) {
					options.data.offset = this._paginate.currentPage * this._paginate.perPage;
					options.data.limit = this._paginate.perPage;
				}

				var success = options.success;
				var me = this;
				options.success = function(collection, data){
					if (options.parse) {
						data = me.parse(data, options)
					}

					me._paginate.currentPage++;
					me._paginate._maxPagesReached = 
						(me._paginate.currentPage == me._paginate.maxPages) || 
						(data.length < me._paginate.perPage);

					return success && success.apply(this, arguments);
				}
				return options;
			},


			nextPage: function (options) {
				options = _.defaults(options||{}, {
					paginate:true
				});

				if (this.isMaxReached()) {
					return false;
				};

				if (options.first) {
					this._paginate.currentPage = 0;
				}

				// if (this._paginate.perPage) {
				// 	options.data.offset = this._paginate.currentPage * this._paginate.perPage;
				// 	options.data.limit = this._paginate.perPage;
				// }

				// var success = options.success;
				// options.success = function(){
				// 	me._paginate.currentPage++;
				// 	me._paginate._maxPagesReached = me._paginate.currentPage == me._paginate.maxPages || data.length < me._paginate.perPage;
				// 	return success && success.apply(this, arguments);
				// }

				// return this.fetch(options);

				// this._preparePaginateFetchOptions(options);
				return this.fetch(options);
			},

			getPage: function (options) {
				
				if (!options) options = {
					data: {}
				};
				
				options.remove = false;
				
				if (!options.data) options.data = {};
				
				if(this._paginate.perPage && options.page != null){
					options.data.offset = options.page * this._paginate.perPage;
					options.data.limit = (options.numberPages||1) * this._paginate.perPage;
				}

				return this.dummyFetch(options);
			},

			fillPage: function (options) {
				if(options.page == null){
					return;
				}

				this._pagesAlreadyFetched = this._pagesAlreadyFetched || [];

				var numberPages = (options.numberPages||1);

				if(!options.refill && this._pagesAlreadyFetched.contains(options.page)){
					return;
				}
				else{
					this._pagesAlreadyFetched.push(options.page);
				}

				var from = options.page * this._paginate.perPage;
				var to = from + numberPages * this._paginate.perPage;

				var me = this;
				var diff = function(){
					return to - me.length;
				}
				while(diff() > 0){
					this.add({});
				}

				return this.getPage(options).done(function(models){
					models.forEach(function(model, i){
						console.log(from)
						me.models[from+i].set(model);
					});
				});
			},


			resetSGSort: function(){
				this.sgSort({});
			},

			sgSort: function (sort) {
				this._sort = sort;
				return this;
			},

			getSGSort: function(){
				if (!this._sort) {
					this._sort = {};
				};
				return this._sort;
			},

			addSGSort: function(name, asc, options){
				options = _.defaults(options||{}, {
					silent:false
				})				
				this.getSGSort()[name] = asc;
				(!options.silent) && this.trigger('change');
				(!options.silent) && this.trigger('add:sort',name, asc);
			},

			removeSGSort: function(name, options){
				options = _.defaults(options||{}, {
					silent:false
				})				
				delete (this.getSGSort())[name];
				(!options.silent) && this.trigger('change');
				(!options.silent) && this.trigger('add:sort', name);
			},

			resetSGFilter: function(){
				this.sgFilter({});
			},

			sgFilter: function (filters) {
				this._filters = filters;
				return this;
			},

			getSGFilter: function(){
				if (!this._filters) {
					this._filters = {};
				};
				return this._filters;
			},

			addSGFilter: function(filterName, value, options){
				options = _.defaults(options||{}, {
					silent:false
				})								
				this.getSGFilter()[filterName] = value;
				
				(!options.silent) && this.trigger('change');
				(!options.silent) && this.trigger('add:filter',filterName, value);
			},

			removeSGFilter: function(filterName, options){
				options = _.defaults(options||{}, {
					silent:false
				})								
				delete this.getSGFilter()[filterName];
				(!options.silent) && this.trigger('change');
				(!options.silent) && this.trigger('remove:filter',filterName);
			},

			isLoading: function () {
				return this._isLoading;
			},
			
		}
	}


});




		