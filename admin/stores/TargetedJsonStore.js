define([
	"dojo/_base/xhr",
	"dojo/_base/declare",
	"./JsonStore",
	"dojo/Deferred",
	"dojo/_base/json",
	"./UrlManager",
	"./util/QueryResults"], 
	function(xhr, declare, JsonStore, Deferred, json, UrlManager, QueryResults) {
	
	return declare("Store.TargetedJsonStore", [JsonStore], {
		
		target: null,
		
		idProperty: "_id",
		
		fullSearch: null,
		
		constructor: function(args){
			this.target = args.target;
		},
		
		getIdentity: function(object){
			// summary:
			//		Returns an object's identity
			// object: Object
			//		The object to get the identity from
			// returns: Number
			return object[this.idProperty];
		},
		
		query: function(query, options){
			// summary:
			//		Queries the store for objects. This will trigger a GET request to the server, with the
			//		query added as a query string.
			// query: Object
			//		The query to use for retrieving objects from the store.
			// options: __QueryOptions?
			//		The optional arguments to apply to the resultset.
			// returns: dojo/store/api/Store.QueryResults
			//		The results of the query, extended with iterative methods.
			/*options = options || {};
	
			var headers = lang.mixin({ Accept: this.accepts }, this.headers, options.headers);
	
			if(options.start >= 0 || options.count >= 0){
				headers.Range = headers["X-Range"] //set X-Range for Opera since it blocks "Range" header
					 = "items=" + (options.start || '0') + '-' +
					(("count" in options && options.count != Infinity) ?
						(options.count + (options.start || 0) - 1) : '');
			}
			var hasQuestionMark = this.target.indexOf("?") > -1;
			if(query && typeof query == "object"){
				query = xhr.objectToQuery(query);
				query = query ? (hasQuestionMark ? "&" : "?") + query: "";
			}
			if(options && options.sort){
				var sortParam = this.sortParam;
				query += (query || hasQuestionMark ? "&" : "?") + (sortParam ? sortParam + '=' : "sort(");
				for(var i = 0; i<options.sort.length; i++){
					var sort = options.sort[i];
					query += (i > 0 ? "," : "") + (sort.descending ? '-' : '+') + encodeURIComponent(sort.attribute);
				}
				if(!sortParam){
					query += ")";
				}
			}
			var results = xhr("GET", {
				url: this.target + (query || ""),
				handleAs: "json",
				headers: headers
			});*/
			console.log(options);
			
			var query = "?offset=";
			query += options.start + "&limit=" + options.count;
			
			if(options.sort){
				query += "&sort_by=";
				if(options.sort[0].descending)
					query += "-";
				query += options.sort[0].attribute;
			}
			
			if(this.fullSearch)
				query += "&*="+this.fullSearch;
			
			if(query == "?")
				query = "";

			var results = this.get(this.target, {}, query);
			results.total = results.then(function(){
				var range = results.ioArgs.xhr.getResponseHeader("Content-Range");
				console.log(range);
				return range && (range = range.match(/\/(.*)/)) && +range[1];
			});
			return QueryResults(results);
		}	
	});
});
	