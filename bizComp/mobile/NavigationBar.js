define(['dojo/_base/declare', 'dojox/mobile/Heading'], function(declare, Heading) {
	
	return declare('bizComp.mobile.NavigationBar', [Heading], {

		constructor: function(args) {
			
		},		
		
		postCreate: function() {
			this.inherited(arguments);
		},
		
	});
});
