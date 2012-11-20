define(['dojo/_base/declare', 'bizComp/_Widget', 'dojo/Evented', 'dojox/mobile/TabBar', 'dojox/mobile/TabBarButton', 'bizComp/mobile/ViewController'], function(declare, _Widget, Evented, TabBar, TabBarButton, ViewController) {
	
	return declare('M2C.Widgets.TabBarViewController', [ViewController, Evented], {
		
		tabBar: null,
		
		tabBarButtons: null,
		
		viewControllers: null,
		
		constructor: function(args){
			this.viewControllers = args.viewControllers;
			this._tabBarButtonElements = args.tabBarButtonElements;
			this._selectedTabIndex = args.selectedTabIndex;
		},
		
		postCreate: function() {
			this.tabBar = new TabBar();
			this.tabBarButtons = [];
						
			var viewsContainerView = new ViewController();
			viewsContainerView.domNode.style.top = "0px";
			viewsContainerView.domNode.style.left = "0px";
			viewsContainerView.domNode.style.width = "320px";
			viewsContainerView.domNode.style.height = this.frame.height-47+"px";
			viewsContainerView.placeAt(this.domNode);
			
			var me = this;
			dojo.forEach(this.viewControllers, function(viewController, i){ 
				var tabBarButton = new TabBarButton({label:me._tabBarButtonElements[i].label, onClick:function(){me.selectTab(i);},icon1:me._tabBarButtonElements[i].iconUnselectedPath, icon2:me._tabBarButtonElements[i].iconSelectedPath});
				me.tabBar.addChild(tabBarButton);
				me.tabBarButtons.push(tabBarButton);
				viewController.domNode.style.display = "none";
				viewController.placeAt(viewsContainerView.domNode);
				//viewController.setFrame({height:me.frame.height-49});
			});
	
			this.tabBar.placeAt(this.domNode);
			if(this._selectedTabIndex)
				this.selectTab(this._selectedTabIndex);
			else
				this.selectTab(0);
			this.tabBar.startup();
		},
		
		selectTab: function(tabIndex) {
			if(this._selectedViewControllers == this.viewControllers[tabIndex])
				return;
			if(this._selectedViewControllers)
				this._selectedViewControllers.domNode.style.display = "none";
			this.viewControllers[tabIndex].domNode.style.display = "";
			this._selectedViewControllers = this.viewControllers[tabIndex];
			this.tabBarButtons[tabIndex]._setSelectedAttr(true);
			this.emit("tabSelected", {tabIndex:tabIndex});
		},
		
		startup: function() {
			this.domNode.style.width = this.domNode.parentNode.style.width;
			this.domNode.style.height = this.domNode.parentNode.style.height;
		}
		
	});
});
