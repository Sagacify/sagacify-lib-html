define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ViewController',
	'saga/widgets/mobile/_ScrollableView',
	'dojo/dom-construct',
	'dojo/on'], 
	
	function(declare, ViewController, ScrollableView, domConstruct, on) {
	
	return declare('saga.PathViewController', [ViewController], {	
		
		scrollableViewController: null,
		
		constructor: function(args) {
			
		},	
		
		postCreate: function() {
			this.inherited(arguments);
			var frame = this.getFrame();
			
			var vc = new ViewController({frame:{x:0, y:0, width:this.frame.width, height:100}});
			vc.placeAt(this.domNode);
			
			var div = domConstruct.create("div", {style:"width:"+this.frame.width+"px;height:"+this.frame.height+"px;"}, vc.domNode);
			var backScrollableView = new ScrollableView();
			backScrollableView.domNode.style.width = this.frame.width + "px";
			backScrollableView.domNode.style.height = this.frame.height + "px";
			backScrollableView.domNode.style.background = "black";
			backScrollableView.placeAt(div);
			backScrollableView.startup();
			domConstruct.create("img", {width:frame.width, src:"http://pcdn.500px.net/20811705/dd5b15fc4cd24a988adf476bdd87af4c65a38e6c/4.jpg"}, backScrollableView.containerNode);
			backScrollableView.containerNode.style.top = "-170px";
			
			domConstruct.create("div", {style:"background:transparent;height:100px"}, this.scrollableViewController.scrollableView.containerNode, "first");
			this.scrollableViewController.domNode.style.position = "absolute";
			this.scrollableViewController.placeAt(vc.domNode);
			
			var me = this;
			on(this.scrollableViewController.scrollableView, "scroll", function(to){
				//console.log(to.y);	
				if(me.scrollableViewController.scrollableView.getPos().y > 0 && to.y == 0) {
					setTimeout(function updateScrollView(){
						var curY = me.scrollableViewController.scrollableView.getPos().y;
						if(curY > 0) {
							backScrollableView.scrollTo({y:curY/3});
							setTimeout(updateScrollView, 10);
						}
					}, 10);
				}
				else {
					backScrollableView.scrollTo({y:to.y/3});
				}
			});	
		},
		
		
	});
});