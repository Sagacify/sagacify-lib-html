define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget', 
	'saga/widgets/mobile/TabBar', 
	'saga/widgets/mobile/TabBarButton', 
	'saga/widgets/mobile/ViewController',
	'dojo/on'], 
	
	function(declare, _Widget, TabBar, TabBarButton, ViewController, on) {
	
	return declare('M2C.Widgets.TabBarViewController', [ViewController], {
		
		tabBar: null,
		
		tabBarButtons: null,
		
		viewControllers: null,
		
		selectedTabIndex: 0,
		
		constructor: function(args){
			if(args)
				this._selectedTabIndex = args.selectedTabIndex;
		},
		
		postCreate: function() {
			this.tabBar = new TabBar({width:this.frame.width});
			this.tabBarButtons = [];
			
			var frame = this.getFrame();
			frame.height -= 49;
			var viewsContainerView = new ViewController({frame:frame});
			viewsContainerView.placeAt(this.domNode);
			
			var me = this;
			dojo.forEach(this.viewControllers, function(viewController, i){ 
				var tabBarButton = new TabBarButton(viewController.tabBarButtonInfo);
				me.tabBar.addButton(tabBarButton);
				me.tabBarButtons.push(tabBarButton);
				on(tabBarButton.domNode, "click", function(evt){
					me.selectTab(i);
				});
				viewController.domNode.style.display = "none";
				viewController.placeAt(viewsContainerView.domNode);
			});

			this.tabBar.placeAt(this.domNode);
			this.viewControllers[0].domNode.style.display = "";
			this.tabBar.selectTab(0);
			this.selectTab(this.selectedTabIndex);
		},
		
		selectTab: function(tabIndex) {
			if(this.selectedTabIndex == tabIndex)
				return;
			this.viewControllers[this.selectedTabIndex].domNode.style.display = "none";
			this.viewControllers[tabIndex].domNode.style.display = "";
			this.onTabSelected.apply(this, [tabIndex]);
			this.selectedTabIndex = tabIndex;
		},
		
		startup: function() {
			this.domNode.style.width = this.domNode.parentNode.style.width;
			this.domNode.style.height = this.domNode.parentNode.style.height;
		},
		
		onTabSelected: function(){
			
		}
		
	});
});
