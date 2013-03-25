define([
	'dojo/_base/declare'
	],
	function(declare){
		declare("Prototyping", null, {

		});
		
		Prototyping.setup = function(){
			Array.prototype.contains = function(item) {
				return this.indexOf(item) != -1;
			};
			
			Array.prototype.containsObject = function(_id){
				return this.filter(function(item){return item._id == _id;}).length > 0;
			};
			
			String.prototype.inject = function(occurences){
				var strToReturn = this;
				occurences.forEach(function(occurence){
					strToReturn = strToReturn.replace("%s", occurence);
				});
				return strToReturn;
			};
			
			String.prototype.startsWith = function(str){
				return this.slice(0, str.length) == str;
			};
		};
		
		return Prototyping;
	}
	);

