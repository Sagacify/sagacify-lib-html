define([
	'dojo', 
	'bizComp/_Widget', 
	'dojox/mobile/View', 
	'dojo/on', 
	'bizComp/mobile/Button', 
	'dojo/dom-construct', 
	'dojo/dom-class', 
	'dojo/_base/connect'], 
	function(dojo, _Widget, View, on, Button, domConstruct, domClass, connect) {
	
	return dojo.declare('bizComp.ActionSheet', [_Widget, View], {
		
		templateString: "<div></div>",
		
		title: null,
		
		cancelButtonTitle: null,
		
		destructiveButtonTitle: null,
		
		otherButtonTitles: [],
		
		constructor: function(args) {
			if(args) {
				this.title = args.title;
				this.cancelButtonTitle = args.cancelButtonTitle;
				this.destructiveButtonTitle = args.destructiveButtonTitle;
				this.otherButtonTitles = args.otherButtonTitles; 
			}
		},
		
		postCreate: function() {
			this.inherited(arguments);
			this.domNode.style.background = "rgb(70,70,70)";
			this.domNode.style.zIndex = 10;
			this.domNode.style.width = Window.frame.width+"px";
			var height = 40 + 40 + 39*this.otherButtonTitles.length;
			if(this.destructiveButtonTitle)
				height += 39;
			this.domNode.style.height = height+"px";
			
			var me = this;
			var top = 20;
			var button;
			if(this.destructiveButtonTitle) {
				button = new Button({label:this.destructiveButtonTitle, style:"position:absolute;top:"+top+"px;left:"+20+"px;width:"+(Window.frame.width-40)+"px"});
				button.placeAt(this.domNode);
				domClass.add(button.domNode, "mblRedButton");
				top += 39;
				on(button.domNode, "click", function(){
					me.onDestructiveButtonPressed.apply(me);
				});
			}
			
			dojo.forEach(this.otherButtonTitles, function(otherButtonTitle, i) {
				button = new Button({label:otherButtonTitle, style:"position:absolute;top:"+top+"px;left:"+20+"px;width:"+(Window.frame.width-40)+"px"});
				button.placeAt(me.domNode);
				top += 39;
				on(button.domNode, "click", function(){
					me.onOtherButtonPressed.apply(me, [{"index":i}]);
				});
			});
			
			top += 10;
			if(this.cancelButtonTitle) {
				button = new Button({label:this.cancelButtonTitle, style:"position:absolute;top:"+top+"px;left:"+20+"px;width:"+(Window.frame.width-40)+"px"});
				button.placeAt(this.domNode);
			}
			else {
				button = new Button({label:"Cancel", style:"position:absolute;top:"+top+"px;left:"+20+"px;width:"+(Window.frame.width-40)+"px"});
				button.placeAt(this.domNode);
			}
			domClass.add(button.domNode, "blackBtn");
			on(button.domNode, "click", function(){
				me.onCancelButtonPressed.apply(me);
			});
			
		},
		
		onDestructiveButtonPressed: function() {
			
		},
		
		onCancelButtonPressed: function() {
			
		},
		
		onOtherButtonPressed: function() {
			
		},
		
		dismissActionSheet: function() {
			this.performTransition(null, -1, "revealv", null);
			
			var me = this;
			this.on("afterTransitionOut", function(){
				me.destroy();
			});	
		},
		
		destroy: function() {
			if(this.mask)
				domConstruct.destroy(this.mask);
			this.inherited(arguments);
		}
	});
});