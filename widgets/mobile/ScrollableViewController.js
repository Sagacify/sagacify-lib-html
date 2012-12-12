define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ViewController',
	'dojox/mobile/ScrollableView',
	'dojo/Evented',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/has',
	'saga/utils/Utils'], 
	
	function(declare, ViewController, ScrollableView, Evented, domConstruct, domClass, has, Utils) {
	
	/*return declare('saga.ScrollableViewController', [ViewController, ScrollableView], {
		
		constructor: function(args) {
			if(has("android") > 2 || has("chrome"))
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
		
	});*/
	
	return declare('saga.ScrollableViewController', [ViewController], {
		
		constructor: function(args) {
			
		},
		
		postCreate: function() {
			this.inherited(arguments);
			
			if(has("android") || has("chrome"))
				var scrollableView = new ScrollableView({scrollType:3});
			else
				var scrollableView = new ScrollableView();
			scrollableView.domNode.style.left = this.frame.x+"px";
			scrollableView.domNode.style.top = this.frame.y+"px";
			scrollableView.domNode.style.width = this.frame.width+"px";
			scrollableView.domNode.style.height = this.frame.height+"px";
			
			for(var i = this.domNode.children.length-1; i >= 0; i--)
				scrollableView.containerNode.appendChild(this.domNode.children[i], "first");

			scrollableView.placeAt(this.domNode);
			scrollableView.startup();
			
		}
		
	});
});
