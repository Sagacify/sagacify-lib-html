define([
	'dojo/_base/declare',
	'bizComp/_Widget', 
	'dojox/mobile/View', 
	'bizComp/mobile/ActionSheet', 
	'dojo/_base/lang', 
	'dojo/dom-construct',
	'dojox/mobile/SpinWheelDatePicker',
	'bizComp/mobile/NavigationBar',
	'dojox/mobile/ToolBarButton',
	'dojo/on'], 
	function(declare, _Widget, View, ActionSheet, lang, domConstruct, SpinWheelDatePicker, NavigationBar, ToolBarButton, on) {
	
	return declare('bizComp.ViewController', [_Widget, View], {
	
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
			viewController.domNode.style.zIndex = "2";
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
			var mask = domConstruct.create("div", {style:"background:rgba(0,0,0,0.4);z-index:2;position:absolute;top:0px;left:0px;width:"+Window.domNode.clientWidth+"px;height:"+Window.domNode.clientHeight+"px"}, Window.domNode);
			
			var actionSheet = new ActionSheet(actionSheetOptions);
			actionSheet.mask = mask;
			
			actionSheet.domNode.style.top = Window.domNode.clientHeight+"px";
			actionSheet.domNode.style.position = "absolute";
			actionSheet.domNode.style.zIndex = "2";
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
		
		presentDatePicker: function() {
			var mask = domConstruct.create("div", {style:"background:rgba(0,0,0,0.4);z-index:2;position:absolute;top:0px;left:0px;width:"+Window.domNode.clientWidth+"px;height:"+Window.domNode.clientHeight+"px"}, Window.domNode);
			
			var pickerSheet = new bizComp.ViewController({id:"blouh", style:"background:rgb(70,70,70);z-index:2;position:absolute;top:"+Window.domNode.clientHeight+"px;left:0px;width:"+Window.domNode.clientWidth+"px;height:244px"});
			pickerSheet.placeAt(Window.domNode);
			
			var navigationBar = new NavigationBar({back:null, href:null, moveTo:"#", label:""});
			navigationBar.placeAt(pickerSheet.domNode);
			
			var cancelButton = new ToolBarButton({label:"Cancel"});
			cancelButton.domNode.style.float = "left";
			cancelButton.placeAt(navigationBar.domNode);
			var me = this;
			on(cancelButton.domNode, "click", function(args){
			 	pickerSheet.performTransition(null, -1, "revealv", null);
			
				pickerSheet.on("afterTransitionOut", function(){
					pickerSheet.destroy();
					domConstruct.destroy(mask);
				});
			});
			
			var todayButton = new ToolBarButton({label:"Today"});
			todayButton.domNode.style.position = "absolute";
			todayButton.domNode.style.left = ((navigationBar.domNode.clientWidth-64)/2)+"px";
			todayButton.placeAt(navigationBar.domNode);
			
			
			var doneButton = new ToolBarButton({label:"Done", btnClass:"mblColorBlue"});
			doneButton.domNode.style.float = "right";
			doneButton.placeAt(navigationBar.domNode);
			
        	var spinWheelDatePicker = new SpinWheelDatePicker();
			spinWheelDatePicker.domNode.style.zIndex = "2";
			spinWheelDatePicker.domNode.style.position = "absolute";
			spinWheelDatePicker.domNode.style.left = ((Window.domNode.clientWidth-318)/2)+"px";
			spinWheelDatePicker.placeAt(pickerSheet.domNode);
			//workaround to fix the problem of misalignment
			dojo.forEach(spinWheelDatePicker.domNode.children, function(child, i){
				if(i <= 2)
					child.style.paddingTop = "100px";
			});
			spinWheelDatePicker.startup();
			
			on(todayButton.domNode, "click", function(args){
			 	spinWheelDatePicker.reset();
			});
			
			on(doneButton.domNode, "click", function(args){
			 	pickerSheet.performTransition(null, -1, "revealv", null);
			
				pickerSheet.on("afterTransitionOut", function(){
					pickerSheet.destroy();
					domConstruct.destroy(mask);
				});
				
				var res = spinWheelDatePicker.getValue();
				me.onDatePicked.apply(me, [{"year":res[0], "month":res[1], "day":res[2]}]);
			});
			
			pickerSheet.performTransition(null, 1, "revealv", null);
			
			pickerSheet.on("afterTransitionOut", function(){
				pickerSheet.domNode.style.display = "";
				pickerSheet.domNode.style.top = Window.domNode.clientHeight-pickerSheet.domNode.clientHeight+"px";
				pickerSheet.domNode.style.left = "0px";
			});
			
			return spinWheelDatePicker;
		},
		
		_updateNavigationBar: function() {
			//method to be overidden by the view controller to handle his navigation bar	
		},
		
		onDatePicked: function() {
			//meth
		}
		
	});
});
