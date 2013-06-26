define([
	"dojo/_base/xhr",
	"dojo/_base/declare",
	"dojo/Deferred",
	"dojo/_base/json"], 
	function(xhr, declare, Deferred, json) {
	
	declare("saga.JsonStore", null, {
		
		
		accepts: "application/javascript, application/json", 
		
		bearerString: function(){
			return (localStorage.access_token.indexOf('-') !== -1) ? 
				'bearer ' + localStorage.access_token :
				'bearer ' + localStorage.username + '|' + localStorage.access_token;
			//return "bearer "+localStorage.access_token;
		},
		
		configureHeader: function(options, removeAuth){
			var headers = options || {};
			headers.Accept = this.accepts;
			if (!removeAuth) {
				headers.Authorization = this.bearerString();	
			};


			headers["Content-Type"] = "application/json";
			if (options) {
				headers["If-Match"] = options.overwrite === true ? "*" : null,
				headers["If-None-Match"] = options.overwrite === false ? "*" : null				
			};
			
			return headers;
		},

		configureUrlWithDict: function(target, query){

			if(query instanceof Object){
				var queryString = "?";
				for (queryKey in query){
					if(queryString != "?")
						queryString += "&";
					queryString += queryKey+"="+query[queryKey];
				}
				target +=queryString
			}
			if (typeof query == "string") {
				return target+query;
			};
			return target;
		},

		configureRequestContent: function(query, headers, deferred, data){
			var request = {};
			request.url = query;
			request.handleAs = "json";
			request.preventCache = true;
			request.headers = headers;
			if(data) {
				request.postData = json.toJson(data);
			}
			request.load = this.onLoadFunction(deferred);
			return request;
		},

		onLoadFunction: function(deferred){
			return function(data){
				// if (DebugMode) {
					// console.log(data);
				// }
				deferred.resolve(data);
			}
		}, 

		onError: function(deferred){
			return function(error){
				deferred.reject(error);
			}
		},


		handlingRelog: function(deferred, afterRelog){
			var me = this;
			return function(error){
					if(error.response.status == 401){
						me.loginFail();
						//me.login(afterRelog, function(error){
						//	me.loginFail();
						//});
					} else {
						me.onError(deferred)(error);
					};
				};
		},

		/*configureJqueryRequest: function(request) {
			var jQueryRequest = {
				type 	: request.method, 
				url 	: request.url,
				dataType: request.handleAs,
				cache 	: request.preventCache,
				headers : request.headers
			};
			if(request.postData) {
				jQueryRequest.data = request.postData;
			}
			return jQueryRequest;
		},

		executeRequest: function(httpMethod, target, headersOptions, queryDict, data, removeAuth, disableRelog){
			var me = this;
			var deferred = new Deferred();

			var query = this.configureUrlWithDict(target, queryDict);
			if (DebugMode) {
				// console.log(httpMethod + " - " + target);
				// console.log(queryDict);
				// console.log(data);
			};

			var headers = this.configureHeader(headersOptions, removeAuth);
			var request = this.configureRequestContent(query, headers, deferred, data);

			var jQueryRequest = this.configureJqueryRequest(request);

			$.ajax(jQueryRequest).done(function(data) {
				me.onLoadFunction(deferred)(data);
			}).fail(function(jqXHR, error) {
				if(disableRelog) {
					me.onError(deferred)(error);
				}
				else {
					this.handlingRelog(deferred, function() {
						var headers = me.configureHeader(headersOptions, removeAuth);
						var request = me.configureRequestContent(query, headers, deferred);

						var jQueryRequest = this.configureJqueryRequest(request);
						$.ajax(jQueryRequest).done(function(data) {
							me.onLoadFunction(deferred)(data);
						}).fail(function(jqXHR, error) {
							me.onError(deferred)(error);
						});
					});
				}
			});

			return deferred;
		},*/

		executeRequest: function(httpMethod, target, headersOptions, queryDict, data, removeAuth, disableRelog){
			var me = this;
			var deferred = new Deferred();

			var headers = this.configureHeader(headersOptions, removeAuth);

			var query = this.configureUrlWithDict(target, queryDict);
			var request = this.configureRequestContent(query, headers, deferred, data);
			if (disableRelog) {
				request.error = this.onError(deferred);
			} else {
				request.error = this.handlingRelog(deferred, function(){
					var headers = me.configureHeader(headersOptions, removeAuth);
					var request = me.configureRequestContent(query, headers, deferred);
					request.error = me.onError(deferred);
					xhr(httpMethod, request);
				});
			}

			xhr(httpMethod, request);

			return deferred;
		},

		get: function(target, options, queryDict, removeAuth){
			return this.executeRequest("GET", target, options, queryDict, null, removeAuth);
		},
		
		post: function(target, object, options, removeAuth, disableRelog){
			return 	this.executeRequest("POST", target, options, null, object, removeAuth, disableRelog);
		},
		
		put: function(target, object, options, removeAuth){
			return this.executeRequest("PUT", target, options, null, object, removeAuth);
		},
		
		remove: function(target, object, options, removeAuth){
			return this.executeRequest("DELETE", target, options, null, object, removeAuth);
		},
		
		login: function(success, failure){

		},
		
		loginFail: function(){
			
		}, 

		getIdentity: function(object){
			if(object._id)
				return object._id;
			console.log("Error for getting object identifier (not _id");
			console.log(object);
			return null;
		}

			
	});
	
	saga.JsonStore.singleton = function() {
		if (Store.JsonStore._singleton == null)
			Store.JsonStore._singleton = new Store.JsonStore();
		return Store.JsonStore._singleton;
	};

	return saga.JsonStore;
});
	