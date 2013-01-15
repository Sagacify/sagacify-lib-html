define([
	'dojo/_base/declare', 
	'dojo/_base/config',
	'saga/widgets/_Widget', 
	'dojox/mobile/View', 
	'dojo/on', 
	'saga/widgets/mobile/Button', 
	'dojo/dom-construct', 
	'dojo/dom-class', 
	'dojo/_base/connect'], 
	function(declare, config, _Widget, View, on, Button, domConstruct, domClass, connect) {
	
	return declare('saga.ActionSheet', [_Widget, View], {
		
		templateString: "<div></div>",
		
		title: null,
		
		buttonHeight: 39,
		
		cancelButtonClass: "",
		
		destructiveButtonClass: "",
		
		otherButtonClass: "",
		
		cancelButtonTitle: null,
		
		destructiveButtonTitle: null,
		
		otherButtonTitles: [],
		
		constructor: function(args) {
			
		},
		
		postCreate: function() {
			//workaround to bind webkit animations (that should work in 'View' class but does not)
			this._animEndHandle = this.connect(this.domNode, "webkitAnimationEnd", "onAnimationEnd");
			this._animStartHandle = this.connect(this.domNode, "webkitAnimationStart", "onAnimationStart");
			if(!config['mblCSS3Transition']){
				this._transEndHandle = this.connect(this.domNode, "webkitTransitionEnd", "onAnimationEnd");
			}
			
			this.inherited(arguments);
			this.domNode.style.background = "rgb(70,70,70)";
			//this.domNode.style.zIndex = 10;
			this.domNode.style.width = Window.frame.width+"px";
			var height = 44 + 45 + (this.buttonHeight+5)*this.otherButtonTitles.length;
			if(this.destructiveButtonTitle)
				height += this.buttonHeight;
			this.domNode.style.height = height+"px";
			
			var me = this;
			var top = 20;
			var button;
			if(this.destructiveButtonTitle) {
				button = new Button({label:this.destructiveButtonTitle, style:"position:absolute;top:"+top+"px;left:"+20+"px;width:"+(Window.frame.width-40)+"px"});
				button.placeAt(this.domNode);
				domClass.add(button.domNode, this.destructiveButtonClass);
				top += this.buttonHeight;
				on(button.domNode, selectEvent, function(){
					me.onDestructiveButtonPressed.apply(me);
				});
			}
			
			dojo.forEach(this.otherButtonTitles, function(otherButtonTitle, i) {
				button = new Button({label:otherButtonTitle, style:"position:absolute;top:"+top+"px;left:"+20+"px;width:"+(Window.frame.width-40)+"px"});
				domClass.add(button.domNode, me.otherButtonClass);
				button.placeAt(me.domNode);
				top += me.buttonHeight+5;
				on(button.domNode, selectEvent, function(){
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
			domClass.add(button.domNode, this.cancelButtonClass);
			on(button.domNode, selectEvent, function(){
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