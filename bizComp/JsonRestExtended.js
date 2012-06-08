define(['dojo/_base/xhr', 'dojo/store/JsonRest', ], 
function(xhr, JsonRest) {
	
	return dojo.declare('bizComp.JsonRestExtended', [JsonRest], {
		
		constructor: function(args){
			
		},
		
		//TODO : This is temporary. Currently, because Django has url /builder/ but Dojo catches /builder/
		//we need to add a trailing slash after a get request.
		get: function(id, options){
			//	summary:
			//		Retrieves an object by its identity. This will trigger a GET request to the server using
			//		the url `this.target + id`.
			//	id: Number
			//		The identity to use to lookup the object
			//	returns: Object
			//		The object in the store that matches the given id.
			var headers = options || {};
			headers.Accept = this.accepts;
			return xhr("GET", {
				url:this.target + id+'/',
				handleAs: "json",
				headers: headers
			});
		},
			
		put: function(object, options, loadFunc, errorFunc){
			// summary:
			//		Stores an object. This will trigger a PUT request to the server
			//		if the object has an id, otherwise it will trigger a POST request.
			// object: Object
			//		The object to store.
			// options: dojo.store.api.Store.PutDirectives?
			//		Additional metadata for storing the data.  Includes an "id"
			//		property if a specific id is to be used.
			//		Includes an "subresource" property if you want to sent a POST 
			//		request only to the attribute of that object.
			//	returns: Deferred!
					
			options = options || {};
			var id = ("id" in options) ? options.id : this.getIdentity(object);
			var hasId = typeof id != "undefined";
			var subresource = ("subResource" in options) ? options.subResource : "undefined";
			var hasSubResource = subresource != "undefined";
			
			// Build URL
			if (hasId){
				url = this.target + id;
				if (hasSubResource){
					// Extend the url to focus on specific subResource
					url+='/'+subresource+'/';
				}
			}
			else {
				url = this.target;
			}
			return xhr(hasId && !options.incremental && !hasSubResource ? "PUT" : "POST", {
					url: url,
					postData: JSON.stringify(object),
					handleAs: "json",
					headers:{
						"Content-Type": "application/json",
						Accept: this.accepts,
						"If-Match": options.overwrite === true ? "*" : null,
						"If-None-Match": options.overwrite === false ? "*" : null
					},
					load : loadFunc,
					error : errorFunc
			});
		},
		
	});
		
});
