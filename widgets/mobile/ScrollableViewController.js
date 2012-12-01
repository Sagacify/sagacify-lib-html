define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojox/mobile/ScrollableView',
	'dojo/dom-construct'], 
	
	function(declare, _Widget, ScrollableView, domConstruct) {
	
	return declare('saga.ScrollableViewController', [ScrollableView], {
		
		consructor: function(args) {
			
		},
		
		postCreate: function() {
			//this.inherited(arguments);
			//domConstruct.place(this.domNode.children[0], this.domNode.children[1]);
			domConstruct.create("div", {style:"width:1440px;height:1000px;background:blue;"}, this.containerNode);
		}
		
	});
});
