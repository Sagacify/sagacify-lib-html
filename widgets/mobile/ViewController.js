define([
	'dojo/_base/declare',
	'dojo/_base/config',
	'saga/widgets/_Widget', 
	'dojox/mobile/View',
	'saga/widgets/mobile/ActionSheet', 
	'dojo/_base/lang', 
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojox/mobile/SpinWheelDatePicker',
	'saga/widgets/mobile/NavigationBar',
	'dojox/mobile/ToolBarButton',
	'dojo/on',
	'dojo/_base/fx'], 
	function(declare, config, _Widget, View, ActionSheet, lang, domConstruct, domClass, SpinWheelDatePicker, NavigationBar, ToolBarButton, on, fx) {
	
	return declare('saga.ViewController', [_Widget, View], {
	
		parent: null,
		
		frame: null,
		
		navigationController: null,
		
		actionSheet: null,
		
		name: null,
		
		iconUnselectedPath: null,
		
		iconSelectedPath: null,
		
		loadingStatus: "loaded",
				
		constructor: function(args){
			if(args)
				this.frame = args.frame;
		},
		
		postCreate: function() {
			//workaround to bind webkit animations (that should work in 'View' class but does not)
			this._animEndHandle = this.connect(this.domNode, "webkitAnimationEnd", "onAnimationEnd");
			this._animStartHandle = this.connect(this.domNode, "webkitAnimationStart", "onAnimationStart");
			if(!config['mblCSS3Transition']){
				this._transEndHandle = this.connect(this.domNode, "webkitTransitionEnd", "onAnimationEnd");
			}
			
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
				if(typeof viewController.startup == "function")
					viewController.startup();
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
		
		presentDatePicker: function(labels) {
			if(!labels)
				labels = {cancel:"Cancel", today:"Today", done:"Done"};
				
			var mask = domConstruct.create("div", {style:"background:rgba(0,0,0,0.4);z-index:2;position:absolute;top:0px;left:0px;width:"+Window.domNode.clientWidth+"px;height:"+Window.domNode.clientHeight+"px"}, Window.domNode);
			
			var pickerSheet = new saga.ViewController({id:"blouh", style:"background:rgb(70,70,70);z-index:2;position:absolute;top:"+Window.domNode.clientHeight+"px;left:0px;width:"+Window.domNode.clientWidth+"px;height:244px"});
			pickerSheet.placeAt(Window.domNode);
			
			var navigationBar = new NavigationBar({back:"", href:null, moveTo:"#", label:""});
			navigationBar.placeAt(pickerSheet.domNode);
			
			var cancelButton = new ToolBarButton({label:labels.cancel});
			cancelButton.domNode.style["float"] = "left";
			cancelButton.placeAt(navigationBar.domNode);
			var me = this;
			on(cancelButton.domNode, "click", function(args){
			 	pickerSheet.performTransition(null, -1, "revealv", null);
			
				pickerSheet.on("afterTransitionOut", function(){
					pickerSheet.destroy();
					domConstruct.destroy(mask);
				});
			});
			
			var todayButton = new ToolBarButton({label:labels.today});
			todayButton.domNode.style.position = "absolute";
			todayButton.domNode.style.left = ((navigationBar.domNode.clientWidth-64)/2)+"px";
			todayButton.placeAt(navigationBar.domNode);
			
			
			var doneButton = new ToolBarButton({label:labels.done, btnClass:"mblColorBlue"});
			doneButton.domNode.style["float"] = "right";
			doneButton.placeAt(navigationBar.domNode);
			
        	var spinWheelDatePicker = new SpinWheelDatePicker();
			spinWheelDatePicker.domNode.style.zIndex = "2";
			spinWheelDatePicker.domNode.style.position = "absolute";
			spinWheelDatePicker.domNode.style.left = ((Window.domNode.clientWidth-318)/2)+"px";
			spinWheelDatePicker.placeAt(pickerSheet.domNode);
			//workaround to fix the problem of misalignment
			/*dojo.forEach(spinWheelDatePicker.domNode.children, function(child, i){
				if(i <= 2)
					child.style.paddingTop = "100px";
			});*/
			spinWheelDatePicker.startup();
			
			console.log(spinWheelDatePicker.domNode.children[0].children[0].children[0])
			if(labels.month){
				dojo.forEach(spinWheelDatePicker.domNode.children[0].children[0].children[0].children, function(child, i){
					child.innerHTML = labels.month(parseInt(child.getAttribute("name"))).substring(0, 3);
				});
			}
			
			
			on(todayButton.domNode, "click", function(args){
			 	spinWheelDatePicker.reset();
			});
			
			on(doneButton.domNode, "click", function(args){
			 	pickerSheet.performTransition(null, -1, "revealv", null);
			
				pickerSheet.on("afterTransitionOut", function(){
					pickerSheet.destroy();
					domConstruct.destroy(mask);
				});
				
				var res = spinWheelDatePicker.get("value").split("-");
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
		
		/*presentLoadingBar: function(){
			if(this.loadingStatus == "transitionToLoading" || this.loadingStatus == "loading")
				return;
			if(!this.loadingBar){
				var loadingBar = new LoadingBar();
				loadingBar.setWidth(this.frame.width);
				loadingBar.domNode.style.position = "absolute";
				loadingBar.domNode.style.top = "-50px";
				loadingBar.domNode.style.zIndex = 100;
				loadingBar.placeAt(this.domNode);
				this.loadingBar = loadingBar;
				
				var me = this;
				this.loadingBar.on("afterTransitionOut", function(){
					if(me.loadingStatus == "loaded" || me.loadingStatus == "loadingToDismiss" || me.loadingStatus == "transitionToLoading"){
						me.loadingBar.domNode.style.display = "";
						me.loadingBar.domNode.style.top = "0px";
						me.loadingBar.domNode.style.left = "0px";
						if(me.loadingStatus == "loadingToDismiss"){
							me.loadingStatus = "loading";
							var interval = setInterval(function(){me.dismissLoadingBar();clearInterval(interval);}, 0);
						}
						else
							me.loadingStatus = "loading";	
					}
					else{
						me.loadingBar.domNode.style.display = "";
						me.loadingBar.domNode.style.top = "-50px";
						me.loadingBar.domNode.style.left = "0px";
						if(me.loadingStatus == "loadingToPresent"){
							me.loadingStatus = "loaded";
							var interval = setInterval(function(){me.presentLoadingBar();clearInterval(interval);}, 0);
						}
						else
							me.loadingStatus = "loaded";
					}
				});
			}
			if(this.loadingStatus == "transitionToLoaded"){
				this.loadingStatus = "loadingToPresent";
			}
			else{
				this.loadingStatus = "transitionToLoading";
				this.loadingBar.performTransition(null, -1, "revealv", null);
			}
		},
		
		dismissLoadingBar: function(){
			if(this.loadingStatus == "transitionToLoaded" || this.loadingStatus == "loaded")
				return;
			if(this.loadingStatus == "transitionToLoading"){
				debugger;
				this.loadingStatus = "loadingToDismiss";	
			}
			else{
				debugger;
				this.loadingStatus = "transitionToLoaded";
				this.loadingBar.performTransition(null, 1, "revealv", null);
			}
		},*/
		
		_updateNavigationBar: function() {
			//method to be overidden by the view controller to handle his navigation bar	
		},
		
		onDatePicked: function() {
			//meth
		}
	});
});
