define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ViewController',
	'dojox/mobile/ScrollableView',
	'dojo/Evented',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/has'], 
	
	function(declare, ViewController, ScrollableView, Evented, domConstruct, domClass, has) {
	
	return declare('saga.ScrollableViewController', [ViewController, ScrollableView], {
		
		constructor: function(args) {
			if(has("android") || has("chrome"))
				this.scrollType = 3;
		},
		
		postCreate: function() {
			this.inherited(arguments);
			var me = this;
			for(var i = this.domNode.classList.length-1; i >= 0; i--){
				var cl = this.domNode.classList[i];
				if(cl != "mblView" && cl != "mblScrollableView"){
					domClass.remove(this.domNode, cl);
					domClass.add(this.containerNode, cl);
				}
			}
			for(var i = this.domNode.children.length-2; i >= 0; i--)
				domConstruct.place(this.domNode.children[i], this.containerNode, "first");
				
		}
		
	});
});
