define(['dojo', 'dojox/mobile/ListItem', 'dojo/_base/connect', 'dojo/on'], function(dojo, ListItem, connect, on) {
	
	return dojo.declare('bizComp.TableViewCell', [ListItem], {
		
		constructor: function(args) {
			
		},
		
		postCreate: function() {
			this.inherited(arguments);
			connect.connect(this.domNode, "onclick", this, "onClick");
		},
		
	});
});
