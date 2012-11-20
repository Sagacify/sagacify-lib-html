define(['dojo/_base/declare', 'dojox/mobile/Heading'], function(declare, Heading) {
	
	return declare('bizComp.mobile.NavigationBar', [Heading], {

		constructor: function(args) {
			
		},		
		
		postCreate: function() {
			this.inherited(arguments);

			if(this.back == "")
				this.domNode.children[0].style.display = "none";
		},
		
		scale: function(scale){
			this.domNode.style.height = scale*44 + "px";
			this.domNode.children[2].style.fontSize = scale*20 + "px";
			this.domNode.children[2].style.lineHeight = scale*44 + "px";
		},
		
		_setBackAttr: function(/*String*/back){
			if(back)
				this.backButton.domNode.style.display = "";
			this.inherited(arguments);
		}
		
	});
});
