define([
	"dojo/_base/xhr",
	"dojo/_base/declare",
	"dojo/Deferred",
	"dojo/_base/json"], 
	function(xhr, declare, Deferred, json) {
	
	declare("saga.JsonStore", null, {
		
		
		accepts: "application/javascript, application/json", 
		
		bearerString: function(){
			return "bearer "+localStorage.access_token;
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
			}
			if (query instanceof String) {
				return target+queryString;
			};
			return target + (queryString || "");
		},

		configureRequestContent: function(query, headers, deferred, data){
			var request = {};
				request.headers = headers;
				request.url = query;
				request.handleAs = "json";
				request.preventCache = true;
				request.postData=json.toJson((data || {}));
				request.load= this.onLoadFunction(deferred);
			return request;
		},

		onLoadFunction: function(deferred){
			return function(data){
				// if (DebugMode) {
					console.log(data);
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
						me.login(afterRelog, function(error){
							me.loginFail();
						});
					} else {
						me.onError(deferred)(error);
					};
				};
		},

		executeRequest: function(httpMethod, target, headersOptions, queryDict, data, removeAuth, disableRelog){

			if (DebugMode) {
				console.log(httpMethod + " - " + target);
				console.log(queryDict);
				console.log(data);
			};

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

			var xhrDeferred =  xhr(httpMethod, request);
			deferred.ioArgs = xhrDeferred.ioArgs;

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
	