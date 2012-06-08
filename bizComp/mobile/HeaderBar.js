define(['dojo', 'dojox/mobile/Heading'], function(dojo, Heading) {
	
	return dojo.declare('bizComp.mobile.HeaderBar', [Heading], {

		constructor: function(args) {
			
		},		
		
		postCreate: function() {
			this.inherited(arguments);
		},
		
	});
});
