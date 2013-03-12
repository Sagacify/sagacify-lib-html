define([
	'dojo/_base/declare'
	],
	function(declare){
		declare("Prototyping", null, {

		});
		
		Prototyping.setup = function(){
			Array.prototype.contains = function(obj) {
				/*var i = this.length;
				while (i--) {
					if (this[i] == obj) {
						return true;
					}
				}
				return false;*/
				return this.indexOf(obj) != -1;
			};
			
			Array.prototype.containsObject = function(_id){
				return this.filter(function(item){return item._id == _id;}).length > 0;
			};
		};
		
		return Prototyping;
	}
	);

