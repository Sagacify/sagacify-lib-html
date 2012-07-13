define(['dojo', 'bizComp/_Widget', 'dojox/mobile/View'], function(dojo, _Widget, View) {
	
	return dojo.declare('bizComp.ViewController', [_Widget, View], {
	
		parent: null,
		
		frame: null,
		
		navigationController: null,
		
		modalViewController: null,	
				
		constructor: function(args){
			if(args)
				this.frame = args.frame;
		},
		
		postCreate: function() {
			this.inherited(arguments);
			if(this.frame)
				this.setFrame(this.frame);
		},
		
		setFrame: function(frame) {
			if(!this.frame)
				this.frame = {};
			
			if(frame.x) {
				this.frame.x = frame.x;
				this.domNode.style.left = frame.x + "px";
			}
			if(frame.y) {
				this.frame.y = frame.y;
				this.domNode.style.top = frame.y + "px";
			}
			if(frame.width) {
				this.frame.width = frame.width;
				this.domNode.style.width = frame.width + "px";
			}
			if(frame.height) {
				this.frame.height = frame.height;
				this.domNode.style.height = frame.height + "px";
			}
		},
		
		presentViewController: function(viewController) {
			viewController.domNode.style.top = Window.domNode.clientHeight+"px";
			viewController.domNode.style.left = "0px";
			viewController.domNode.style.width = Window.domNode.clientWidth+"px";
			viewController.domNode.style.height = Window.domNode.clientHeight+"px";
			viewController.domNode.style.zIndex = "100";
			viewController.domNode.style.position = "absolute";
			viewController.placeAt(Window.domNode);
			viewController.performTransition(null, 1, "revealv", null);
			
			viewController.on("afterTransitionOut", function(){
				viewController.domNode.style.display = "";
				viewController.domNode.style.top = "0px";
				viewController.domNode.style.left = "0px";
			});
		},
		
		dismissViewController: function() {
			this.performTransition(null, -1, "revealv", null);
			
			var me = this;
			this.on("afterTransitionOut", function(){
				me.destroyRecursive();
			});	
		}
		
	});
});
