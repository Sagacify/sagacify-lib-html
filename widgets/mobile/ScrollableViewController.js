define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ViewController',
	'dojox/mobile/ScrollableView',
	'dojo/dom-construct',
	'dojo/has'], 
	
	function(declare, ViewController, ScrollableView, domConstruct, has) {
	
	return declare('saga.ScrollableViewController', [ViewController, ScrollableView], {
		
		constructor: function(args) {
			if(has("android") || has("chrome"))
				this.scrollType = 3;
		},
		
		postCreate: function() {
			this.inherited(arguments);
			var me = this;
			for(var i = this.domNode.children.length-2; i >= 0; i--)
				domConstruct.place(this.domNode.children[i], this.containerNode);
		}
		
	});
});
