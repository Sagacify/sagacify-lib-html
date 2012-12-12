define([
	'dojo/_base/declare', 
	'./ViewController', 
	'./NavigationBar', 
	'dojo/_base/connect', 
	'dojo/on', 
	'dojo/dom-class', 
	'dojo/dom-construct'], 
	
	function(declare, ViewController, NavigationBar, connect, on, domClass, domConstruct) {
	
	return declare('saga.NavigationController', [ViewController], {
		
		_viewControllers: null,
		
		_customNavBar: false,
		
		navigationBar: null,

		constructor: function(args) {
			if(args.viewController) {
				this._viewControllers = [args.viewController];
				args.viewController.navigationController = this;
			}
		},		
		
		postCreate: function() {
			this.inherited(arguments);
			this.domNode.style.overflow = "hidden";
			
			var label = this._viewControllers[0].name?this._viewControllers[0].name:"";
			if(!this.navigationBar){
				this.navigationBar = new NavigationBar({back:"", href:null, moveTo:"#", label:label});
	        	this.navigationBar.placeAt(this.domNode);
	        	domClass.add(this.navigationBar.domNode, "mblHeadingCenterTitle");
	        	this.navigationBar.startup();		
			}
			else{
				this.navigationBar.placeAt(this.domNode);
				this._customNavBar = true;
				this._updateNavigationBar();
			}	
        	
			this._viewControllers[0].placeAt(this.domNode);
			this.domNode.style.width = this._viewControllers[0].domNode.style.width;
			this.domNode.style.height = this._viewControllers[0].domNode.style.height+44;
			
			//if(typeof this._viewControllers[0]._updateNavigationBar == "function")
				//this._viewControllers[0]._updateNavigationBar();
		},
		
		
		_updateNavigationBar: function() {
			if(!this._customNavBar){
				this.navigationBar.destroyRecursive();
				this.navigationBar = new NavigationBar({back:"", href:null, moveTo:"#", label:this._viewControllers[0].name});
	        	this.navigationBar.placeAt(this.domNode, 0);
	        	domClass.add(this.navigationBar.domNode, "mblHeadingCenterTitle");
	        	this.navigationBar.startup();
				
				if(this._viewControllers.length >= 2) {
					if(this._viewControllers[1].name)
						this.navigationBar._setBackAttr(this._viewControllers[1].name);
					else
						this.navigationBar._setBackAttr("Back");
					var me = this;
		        	/*dojo.forEach(this.navigationBar.domNode.childNodes, function(childNode, i){
						if(domClass.contains(childNode, "mblArrowButton")) {
			        		connect.connect(childNode, "onclick", this, function(){
			        			me.popViewController();
			        		});
			        	}
		        	});*/
		        	on(this.navigationBar.domNode.childNodes[0], "click", function(){
		        		me.popViewController();
		        	});
				}
				else {
					this.navigationBar._setBackAttr(null);
				}
				if(this._viewControllers[0].name)
					this.navigationBar._setLabelAttr(this._viewControllers[0].name);
				else
					this.navigationBar._setLabelAttr(null);
			}
			else{
				this.navigationBar.reset();
				if(this.frontViewController().title)
					this.navigationBar.setTitle(this.frontViewController().title);
				var me = this;
				on(this.navigationBar.backButton, "click", function(){
	        		me.popViewController();
	        	});
				if(this._viewControllers.length >= 2)
					this.navigationBar.backButton.style.display = "";
				else
					this.navigationBar.backButton.style.display = "none";
			}
			
			if(typeof this._viewControllers[0]._updateNavigationBar == "function")	
				this._viewControllers[0]._updateNavigationBar();
		},
		
		frontViewController: function() {
			return this._viewControllers[0];
		},
		
		setFrontViewController: function(viewController) {
			dojo.forEach(this._viewControllers, function(viewController){
				if(viewController.destroyRecursive)
					viewController.destroyRecursive();
			});
			this._viewControllers = [viewController];
			viewController.navigationController = this;
			viewController.placeAt(this.domNode);
			this._updateNavigationBar();

			if(viewController.title)
				this.navigationBar.setTitle(viewController.title);	

		},
		
		pushViewController: function(viewController) {
			viewController.placeAt(this.domNode);
			//if(typeof viewController.startup == "function")
				//viewController.startup();
			viewController.domNode.style.height = (viewController.frame.height+44)+"px"; 
			var fakediv = domConstruct.create("div", {style:"width:"+viewController.frame.width+"px;height:44px"}, viewController.domNode, "first");
			viewController.domNode.style.position = "";
			this._viewControllers[0].performTransition(viewController.id, 1, "slide", null);
			//var eventsBlocker = domConstruct.create("div", {style:"z-index:2;position:absolute;top:0px;left:0px;width:"+Window.frame.width+"px;height:"+Window.frame.height+"px"}, this.domNode);
			this._viewControllers[0].on("afterTransitionOut", function(){
				if(viewController.domNode){
					viewController.domNode.style.height = viewController.frame.height+"px"; 
					domConstruct.destroy(fakediv);
					//domConstruct.destroy(eventsBlocker);
					alert("after trans");
				}
			});
			viewController.navigationController = this;
			this._viewControllers.splice(0, 0, viewController);
			
			this._updateNavigationBar();

			if(viewController.title)
				this.navigationBar.setTitle(viewController.title);	

		},
		
		popViewController: function() {
			if(this._viewControllers.length >= 2) {
				var viewControllerToPop = this._viewControllers.splice(0, 1)[0];
				this._viewControllers[0].domNode.style.height = (this._viewControllers[0].frame.height+44)+"px";
				var fakediv = domConstruct.create("div", {style:"width:"+this._viewControllers[0].frame.width+"px;height:44px"}, this._viewControllers[0].domNode, "first");
				viewControllerToPop.performTransition(this._viewControllers[0].id, -1, "slide", null);
				var eventsBlocker = domConstruct.create("div", {style:"z-index:2;position:absolute;top:0px;left:0px;width:"+Window.frame.width+"px;height:"+Window.frame.height+"px"}, this.domNode);
				var viewControllerToAppear = this._viewControllers[0];
				viewControllerToPop.on("afterTransitionOut", function(){
					if(viewControllerToAppear.domNode){
						domConstruct.destroy(fakediv);
						domConstruct.destroy(eventsBlocker);
						viewControllerToAppear.domNode.style.height = viewControllerToAppear.frame.height+"px"; 
						viewControllerToPop.destroyRecursive();	
					}
				});
				this._updateNavigationBar();

				if(viewControllerToAppear.title)
					this.navigationBar.setTitle(viewControllerToAppear.title);	

			} 
		}
			
	});
});
