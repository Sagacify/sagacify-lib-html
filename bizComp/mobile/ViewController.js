define(['dojo', 'bizComp/_Widget', 'dojox/mobile/View', 'bizComp/mobile/ActionSheet', 'dojo/_Base/lang', 'dojo/dom-construct'], function(dojo, _Widget, View, ActionSheet, lang, domConstruct) {
	
	return dojo.declare('bizComp.ViewController', [_Widget, View], {
	
		parent: null,
		
		frame: null,
		
		navigationController: null,
		
		actionSheet: null,
		
		name: null,
		
		iconUnselectedPath: null,
		
		iconSelectedPath: null,
				
		constructor: function(args){
			if(args)
				this.frame = args.frame;
		},
		
		postCreate: function() {
			this.inherited(arguments);
			if(this.frame)
				this.setFrame(this.frame);
		},
		
		getFrame: function() {
			return lang.clone(this.frame);
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
				me.destroy();
			});	
		},
		
		presentActionSheet: function(actionSheetOptions) {
			var mask = domConstruct.create("div", {style:"background:rgba(0,0,0,0.4);z-index:10;position:absolute;top:0px;left:0px;width:"+Window.domNode.clientWidth+"px;height:"+Window.domNode.clientHeight+"px"}, Window.domNode);
			
			var actionSheet = new ActionSheet(actionSheetOptions);
			actionSheet.mask = mask;
			
			actionSheet.domNode.style.top = Window.domNode.clientHeight+"px";
			actionSheet.domNode.style.position = "absolute";
			actionSheet.placeAt(Window.domNode);
			this.actionSheet = actionSheet;
			actionSheet.performTransition(null, 1, "revealv", null);
			
			actionSheet.on("cancelButtonPressed", function(){
				actionSheet.dismissActionSheet();
				domConstruct.destroy(mask);
			});
			
			actionSheet.on("afterTransitionOut", function(){
				actionSheet.domNode.style.display = "";
				actionSheet.domNode.style.top = Window.domNode.clientHeight-actionSheet.domNode.clientHeight+"px";
				actionSheet.domNode.style.left = "0px";
			});
			
			return actionSheet;
		},
		
		dismissActionSheet: function() {
			
		},
		
		_updateNavigationBar: function() {
			//method to be overidden by the view controller to handle his navigation bar	
		}
		
	});
});
