define(['dojo', './View', 'dojox/mobile/Heading', 'dojo/_base/connect', 'dojo/on', 'dojo/dom-class'], function(dojo, View, Heading, connect, on, domClass) {
	
	return dojo.declare('bizComp.NavigationView', [View], {
		
		_viewControllers: null,
		
		headerBar: null,

		constructor: function(args) {
			if(args.viewController) {
				this._viewControllers = [args.viewController];
				args.viewController.navigationViewController = this;
			}
		},		
		
		postCreate: function() {
			this.domNode.style.overflow = "hidden";
			
			this.headerBar = new Heading({back:null, href:null, moveTo:"#", label:this._viewControllers[0].name});
        	this.headerBar.placeAt(this.domNode);
        	domClass.add(this.headerBar.domNode, "mblHeadingCenterTitle");
        	this.headerBar.startup();		
        	
			this._viewControllers[0].placeAt(this.domNode);
			this.domNode.style.width = this._viewControllers[0].domNode.style.width;
			this.domNode.style.height = this._viewControllers[0].domNode.style.height;
		},
		
		_updateHeaderBar: function() {
			if(this._viewControllers.length >= 2) {
				if(this._viewControllers[1].name)
					this.headerBar._setBackAttr(this._viewControllers[1].name);
				else
					this.headerBar._setBackAttr("Back");
				var me = this;
	        	dojo.forEach(this.headerBar.domNode.childNodes, function(childNode, i){
	        		connect.connect(childNode, "onclick", this, function(){
	        			me.popViewController();
	        		});
	        	});
			}
			else {
				this.headerBar._setBackAttr(null);
			}
			if(this._viewControllers[0].name)
				this.headerBar._setLabelAttr(this._viewControllers[0].name);
			else
				this.headerBar._setLabelAttr(null);
		},
		
		frontViewController: function() {
			return this._viewControllers[0];
		},
		
		pushViewController: function(viewController) {
			viewController.placeAt(this.domNode);
			this._viewControllers[0].performTransition(viewController.id, 1, "slide", null);
			viewController.navigationViewController = this;
			this._viewControllers.splice(0, 0, viewController);
			this._updateHeaderBar();
		},
		
		popViewController: function() {
			if(this._viewControllers.length >= 2) {
				var viewControllerToPop = this._viewControllers.splice(0, 1)[0];
				viewControllerToPop.domNode.style.display = "";
				viewControllerToPop.performTransition(this._viewControllers[0].id, -1, "slide", null);
				viewControllerToPop.on("afterTransitionOut", function(){viewControllerToPop.destroyRecursive();});
				this._updateHeaderBar();
			} 
		},
			
	});
});
