define([
	'dojo/_base/declare'
	],
	function(declare){
		declare("Prototyping", null, {

		});
		
		Prototyping.setup = function(){
			Array.prototype.contains = function(obj) {
				var i = this.length;
				while (i--) {
					if (this[i] == obj) {
						return true;
					}
				}
				return false;
			}
		};
		
		return Prototyping;
	}
	);

