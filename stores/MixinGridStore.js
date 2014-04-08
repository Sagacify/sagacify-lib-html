define([
	"dojo/_base/declare",
	"./util/QueryResults",
	"dojo/io-query"
	], 
	function(declare, QueryResults, ioQuery) {
	
	return declare("saga.MixinGridStore", null, {

		query: function(query, options){

			var query = "?offset=";
			query += options.start + "&limit=" + options.count;

			if (this.filtersToApply && this.filtersToApply.length) {
				var filtersObj = {};
				for (var i = 0; i < this.filtersToApply.length; i++) {
					var aFilter = this.filtersToApply[i];
					filtersObj["filter_"+aFilter.key] = aFilter.value;
				};
				query += "&"+ioQuery.objectToQuery(filtersObj);

			}

			// if (this.filtersToApply && this.filtersToApply.length) {
			// 	for (var i = 0; i < this.filtersToApply.length; i++) {
			// 		var fitlerObj = this.filtersToApply[i];
			// 		query +="&filter_"+fitlerObj.key+"="+fitlerObj.value;
			// 	};
			// };
			
			if(options.sort){
				query += "&sort_by=";
				if(options.sort[0].descending)
					query += "-";
				query += options.sort[0].attribute;
			}

			//Search
			if (this.searchFilter) {
				query +="&*="+this.searchFilter;
			};

			
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
				console.log(range, arguments);
				return range && (range = range.match(/\/(.*)/)) && +range[1];
			});
			
			this.qr = QueryResults(results)
			return this.qr;
		}, 


		getTarget: function(){
			/* override me */
			debugger
			return null;
		},

		getSize: function(){
			//Improve me.
			return parseInt(this.range.split("/")[1]);
		}
	})
});
	


