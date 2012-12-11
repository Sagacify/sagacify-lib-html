define([
	'dojo/_base/declare',
	'dojo/on', 
	'dojo/has'],
	function(declare, on, has) {
		declare('saga.Utils', null, {

			constructor: function(args){
				
			},

			postCreate: function() {
				
			}
		});
		
		saga.Utils.svgSupport = function(){
			var support = has("android")?has("android")>=3:true;
			return support;
		};
		
		return saga.Utils;
});
