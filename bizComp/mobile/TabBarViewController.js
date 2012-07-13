define(['dojo', 'bizComp/_Widget', 'dojox/mobile/TabBar', 'dojox/mobile/TabBarButton', 'dojox/mobile/View'], function(dojo, _Widget, TabBar, TabBarButton, NavigationView) {
	
	return dojo.declare('M2C.Widgets.TabBarViewController', [_Widget], {
		
		tabBar: null,
		
		tabBarButtons: null,
		
		viewControllers: null,
		
		constructor: function(args){
			this.viewControllers = args.viewControllers;
			this._tabBarButtonElements = args.tabBarButtonElements;
			this._selectedTabIndex = args.selectedTabIndex;
		},
		
		postCreate: function() {
			this.domNode.style.backgroundColor = "purple";
			this.tabBar = new TabBar();
			this.tabBarButtons = [];
			
			var viewsContainerView = new dojox.mobile.View();
			viewsContainerView.domNode.style.top = "0px";
			viewsContainerView.domNode.style.left = "0px";
			viewsContainerView.domNode.style.width = "320px";
			viewsContainerView.domNode.style.height = "412px";
			viewsContainerView.placeAt(this.domNode);
			
			var me = this;
			dojo.forEach(this.viewControllers, function(viewController, i){ 
				var tabBarButton = new TabBarButton({label:me._tabBarButtonElements[i].label, onClick:function(){me.selectTab(i);},icon1:me._tabBarButtonElements[i].iconUnselectedPath, icon2:me._tabBarButtonElements[i].iconSelectedPath});
				me.tabBar.addChild(tabBarButton);
				me.tabBarButtons.push(tabBarButton);
				viewController.domNode.style.display = "none";
				viewController.placeAt(viewsContainerView);
				viewController.setFrame({height:412});
			});
	
			this.tabBar.placeAt(this.domNode);
			if(this._selectedTabIndex)
				this.selectTab(this._selectedTabIndex);
			else
				this.selectTab(0);
			this.tabBar.startup();
		},
		
		selectTab: function(tabIndex) {
			if (this._selectedViewControllers)
				this._selectedViewControllers.domNode.style.display = "none";
			this.viewControllers[tabIndex].domNode.style.display = "";
			this._selectedViewControllers = this.viewControllers[tabIndex];
			this.tabBarButtons[tabIndex].select();
		},
		
		startup: function() {
			this.domNode.style.width = this.domNode.parentNode.style.width;
			this.domNode.style.height = this.domNode.parentNode.style.height;
		}
		
	});
});
