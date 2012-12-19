define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ViewController',
	'saga/widgets/mobile/_ScrollableView',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/has',
	'saga/utils/Utils'], 
	
	function(declare, ViewController, ScrollableView, domConstruct, domClass, has, Utils) {
	
	return declare('saga.ScrollableViewController', [ViewController], {
		
		constructor: function(args) {
			
		},
		
		postCreate: function() {
			this.inherited(arguments);
			
			var scrollableView = new ScrollableView();
			scrollableView.domNode.style.left = this.frame.x+"px";
			scrollableView.domNode.style.top = this.frame.y+"px";
			scrollableView.domNode.style.width = this.frame.width+"px";
			scrollableView.domNode.style.height = this.frame.height+"px";
			
			for(var i = this.domNode.children.length-1; i >= 0; i--)
				domConstruct.place(this.domNode.children[i], scrollableView.containerNode, "first");

			scrollableView.placeAt(this.domNode);
			scrollableView.startup();
			
		}
		
	});
});
