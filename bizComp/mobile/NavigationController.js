define(['dojo', './ViewController', './NavigationBar', 'dojo/_base/connect', 'dojo/on', 'dojo/dom-class', 'dojox/mobile/View'], function(dojo, ViewController, NavigationBar, connect, on, domClass) {
	
	return dojo.declare('bizComp.NavigationController', [ViewController], {
		
		_viewControllers: null,
		
		navigationBar: null,

		constructor: function(args) {
			if(args.viewController) {
				this._viewControllers = [args.viewController];
				args.viewController.navigationController = this;
			}
		},		
		
		postCreate: function() {
			this.domNode.style.overflow = "hidden";
			
			this.navigationBar = new NavigationBar({back:null, href:null, moveTo:"#", label:this._viewControllers[0].name});
        	this.navigationBar.placeAt(this.domNode);
        	domClass.add(this.navigationBar.domNode, "mblHeadingCenterTitle");
        	this.navigationBar.startup();		
        	
			this._viewControllers[0].placeAt(this.domNode);
			this.domNode.style.width = this._viewControllers[0].domNode.style.width;
			this.domNode.style.height = this._viewControllers[0].domNode.style.height+44;
			
			this._viewControllers[0]._updateNavigationBar();
		},
		
		
		_updateNavigationBar: function() {
			
			this.navigationBar.destroyRecursive();
			this.navigationBar = new NavigationBar({back:null, href:null, moveTo:"#", label:this._viewControllers[0].name});
        	this.navigationBar.placeAt(this.domNode, 0);
        	domClass.add(this.navigationBar.domNode, "mblHeadingCenterTitle");
        	this.navigationBar.startup();
			
			if(this._viewControllers.length >= 2) {
				if(this._viewControllers[1].name)
					this.navigationBar._setBackAttr(this._viewControllers[1].name);
				else
					this.navigationBar._setBackAttr("Back");
				var me = this;
	        	dojo.forEach(this.navigationBar.domNode.childNodes, function(childNode, i){
	        		connect.connect(childNode, "onclick", this, function(){
	        			me.popViewController();
	        		});
	        	});
			}
			else {
				this.navigationBar._setBackAttr(null);
			}
			if(this._viewControllers[0].name)
				this.navigationBar._setLabelAttr(this._viewControllers[0].name);
			else
				this.navigationBar._setLabelAttr(null);
				
			this._viewControllers[0]._updateNavigationBar();
		},
		
		frontViewController: function() {
			return this._viewControllers[0];
		},
		
		setFrontViewController: function(viewController) {
			this._viewControllers = [args.viewController];
				args.viewController.navigationController = this;
		},
		
		pushViewController: function(viewController) {
			viewController.placeAt(this.domNode);
			this._viewControllers[0].performTransition(viewController.id, 1, "slide", null);
			viewController.navigationController = this;
			this._viewControllers.splice(0, 0, viewController);
			this._updateNavigationBar();
		},
		
		popViewController: function() {
			if(this._viewControllers.length >= 2) {
				var viewControllerToPop = this._viewControllers.splice(0, 1)[0];
				viewControllerToPop.domNode.style.display = "";
				viewControllerToPop.performTransition(this._viewControllers[0].id, -1, "slide", null);
				viewControllerToPop.on("afterTransitionOut", function(){viewControllerToPop.destroyRecursive();});
				this._updateNavigationBar();
			} 
		},
			
	});
});
