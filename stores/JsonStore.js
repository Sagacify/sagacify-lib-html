define([
	"dojo/_base/xhr",
	"dojo/_base/declare",
	"dojo/Deferred",
	"dojo/_base/json"], 
	function(xhr, declare, Deferred, json) {
	
	declare("saga.JsonStore", null, {
		
		
		// summary:
		//		This is a basic store for RESTful communicating with a server through JSON
		//		formatted data. It implements dojo.store.api.Store.
		// params:
		// @args : {'authON':true}
	
		constructor: function(args){
			
			//this.authON = args.authON;
			//this.authON = true;
		},
		
		// Header
		// accepts: String
		//		Defines the Accept header to use on HTTP requests
		accepts: "application/javascript, application/json", 
		
		// authorization string
		// 

	
		bearerString: "bearer "+localStorage.access_token,
		
		

		get: function(target, options, query){
			var headers = options || {};
			headers.Accept = this.accepts;
			headers.Authorization = "bearer "+localStorage.access_token;
			if(query instanceof Object){
				var queryString = "?";
				for (queryKey in query){
					if(queryString != "?")
						queryString += "&";
					queryString += queryKey+"="+query[queryKey];
				}
				query = queryString;
			}
			console.log(this.bearerString);
			console.log("GET "+target + (query || ""));
			var me = this;
			var deferred = new Deferred();
			var xhrDeferred = xhr("GET", {
				url:target + (query || ""),
				handleAs: "json",
				preventCache: true,
				headers: headers,
				load: function(data){
					console.log(data);
					deferred.resolve(data);
				},
				error: function(error){
					if(error.response.status == 401){
						me.login(function(data){
							headers.Authorization = "bearer "+localStorage.access_token;
							xhr("GET", {
								url:target + (query || ""),
								handleAs: "json",
								preventCache: true,
								headers: headers,
								load: function(data){
									console.log(data);
									deferred.resolve(data);
								},
								error: function(error){
									deferred.reject(error);
								}
							});
						}, function(error){
							me.loginFail();
							deferred.reject(error);
						});
					}
				}
			});
			deferred.ioArgs = xhrDeferred.ioArgs;
			return deferred;
		},
		
		post: function(target, object, options, removeAuth){
			var me = this;
			options = options || {};
			
			var headers = options || {};
			headers.Accept = this.accepts;
			if(!removeAuth)
				headers.Authorization = "bearer "+localStorage.access_token;
			headers["Content-Type"] = "application/json";
			headers["If-Match"] = options.overwrite === true ? "*" : null,
			headers["If-None-Match"] = options.overwrite === false ? "*" : null
			console.log("POST "+target);
			console.log(object);

			var deferred = new Deferred();
			xhr.post({
				url: target,
				postData: json.toJson(object),
				handleAs: "json",
				preventCache: true,
				headers: headers,
				load: function(data){
					console.log(data);
					deferred.resolve(data);
				},
				error: function(error){

					if(error.response.status == 401){
						if(target == "/auth/local/login"){
							me.loginFail();
							deferred.reject(error);
							return;
						}
						me.login(function(loginData){
							headers.Authorization = "bearer "+localStorage.access_token;
							xhr("POST", {
								url:target,
								postData: json.toJson(object),
								handleAs: "json",
								preventCache: true,
								headers: headers,
								load: function(data){
									//debugger;
									deferred.resolve(data);
								},
								error: function(error){
									//debugger;
									deferred.reject(error);
								}
							});
						}, function(loginError){
							me.loginFail();
							deferred.reject(loginError);
						});
					}
				}
			});
			return deferred;
		},
		
		put: function(target, object, options){
			var me = this;
			options = options || {};
			
			var headers = options || {};
			headers.Accept = this.accepts;
			headers.Authorization = "bearer "+localStorage.access_token;
			headers["Content-Type"] = "application/json";
			headers["If-Match"] = options.overwrite === true ? "*" : null,
			headers["If-None-Match"] = options.overwrite === false ? "*" : null
			console.log("PUT "+target);
			console.log(object);
			var deferred = new Deferred();
			xhr.put({
				url: target,
				putData: json.toJson(object),
				handleAs: "json",
				preventCache: true,
				headers:headers,
				load: function(data){
					deferred.resolve(data);
				},
				error: function(error){
					if(error.response.status == 401){
						me.login(function(loginData){
							headers.Authorization = "bearer "+localStorage.access_token;
							xhr("PUT", {
								url:target,
								putData: json.toJson(object),
								handleAs: "json",
								preventCache: true,
								headers: headers,
								load: function(data){
									deferred.resolve(data);
								},
								error: function(error){
									deferred.reject(error);
								}
							});
						}, function(loginError){
							me.loginFail();
							deferred.reject(loginError);
						});
					}
				}
			});
			return deferred;
		},
		
		
		remove: function(target, options){
			var me = this;
			options = options || {};

			var headers = options || {};
			headers.Accept = this.accepts;
			headers.Authorization = "bearer "+localStorage.access_token;
			headers["Content-Type"] = "application/json";
			headers["If-Match"] = options.overwrite === true ? "*" : null,
			headers["If-None-Match"] = options.overwrite === false ? "*" : null
			console.log("DELETE "+target);
			var deferred = new Deferred();
			dojo.xhrDelete({
				url:target,
				handleAs: "json",
				preventCache: true,
				headers:headers,
				load: function(data){
					console.log("del ok");
					deferred.resolve(data);
				},
				error: function(error){
					if(error.response.status == 401){
						me.login(function(loginData){
							headers.Authorization = "bearer "+localStorage.access_token;
							xhr("DELETE", {
								url:target,
								handleAs: "json",
								preventCache: true,
								headers: headers,
								load: function(data){
									deferred.resolve(data);
								},
								error: function(error){
									deferred.reject(error);
								}
							});
						}, function(loginError){
							deferred.reject(loginError);
						});
					}
					else{
						me.loginFail();
						deferred.reject(error);
					}
				}
			});
			return deferred;
		},
		
		login: function(success, failure){
		},
		
		loginFail: function(){
			
		}
			
	});
	
	saga.JsonStore.singleton = function() {
		if (Store.JsonStore._singleton == null)
			Store.JsonStore._singleton = new Store.JsonStore();
		return Store.JsonStore._singleton;
	};

	return saga.JsonStore;
});
	