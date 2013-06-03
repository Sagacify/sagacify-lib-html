define([
	"dojo/_base/declare",
	"./util/QueryResults",
	], 
	function(declare, QueryResults) {
	
	return declare("saga.MixinGridStore", null, {

		query: function(query, options){
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

			if(this.inArray)
				query += "&in="+dojo.toJson(this.inArray);
			
			if(query == "?")
				query = "";
			var target = this.getTarget();
			var results = this.get(target, this.body||{}, query);
			var me = this;
			results.total = results.then(function(){
				var range = results.ioArgs.xhr.getResponseHeader("Content-Range");
				me.range = range;
				console.log(range);
				return range && (range = range.match(/\/(.*)/)) && +range[1];
			});
			
			this.qr = QueryResults(results)
			return this.qr;
		}, 

		getTarget: function(){
			/* override me */
			debugger
			return null;
		}
	})
});
	


