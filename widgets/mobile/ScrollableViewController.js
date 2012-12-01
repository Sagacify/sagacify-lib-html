define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ViewController',
	'dojox/mobile/ScrollableView',
	'dojo/dom-construct'], 
	
	function(declare, ViewController, ScrollableView, domConstruct) {
	
	return declare('saga.ScrollableViewController', [ViewController, ScrollableView], {
		
		consructor: function(args) {
			
		},
		
		postCreate: function() {
			this.inherited(arguments);
			domConstruct.place(this.domNode.children[0], this.domNode.children[1]);
		}
		
	});
});
