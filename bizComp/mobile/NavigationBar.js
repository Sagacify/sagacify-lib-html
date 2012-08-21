define(['dojo/_base/declare', 'dojox/mobile/Heading'], function(declare, Heading) {
	
	return declare('bizComp.mobile.NavigationBar', [Heading], {

		constructor: function(args) {
			
		},		
		
		postCreate: function() {
			this.inherited(arguments);
			console.log(this.domNode.children[0]);
			if(this.back == "")
				this.domNode.children[0].style.display = "none";
		},
		
	});
});
