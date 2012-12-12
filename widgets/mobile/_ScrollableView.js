define([
	'dojo/_base/declare', 
	'dojox/mobile/ScrollableView',
	'dojo/has'], 
	
	function(declare, ScrollableView, has) {
	
	return declare('saga._ScrollableView', [ScrollableView], {
		
		constructor: function(args) {
			if(has("android") > 2 || has("chrome"))
				this.scrollType = 3;
		},
		
	});
});
