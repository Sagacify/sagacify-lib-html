;define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojo/text!./templates/TabBar.html',
	'dojo/on',
	'dojo/_base/lang',
	'dojo/dom-construct',
	'dojo/dom-attr',
	'saga/utils/Utils'], 
	
	function(declare, _Widget, template, on, lang, domConstruct, domAttr, Utils) {
	
	return declare('saga.TabBar', [_Widget], {
		
		buttons: null,
		
		width: 320,
		
		selectedTabIndex: null,
		
		templateString: template,
				
		constructor: function(args){
			
		},
		
		postCreate: function() {
			this.inherited(arguments);
			this.navNode.style.width = this.width+"px";
			this.buttons = [];
		},
		
		addButton: function(tabBarButton){
			tabBarButton.placeAt(this.buttonsContainer);
			this.buttons.push(tabBarButton);
			var me = this;
			dojo.forEach(this.buttons, function(button, i){
				button.domNode.style.width = (100/me.buttons.length)+"%";
				on(button.domNode, selectEvent, function(evt){
					evt.preventDefault();
					me.selectTab(i);
				});
			});
		},
		
		selectTab: function(tabIndex){
			dojo.forEach(this.buttons, function(button, i){
				if(tabIndex == i)
					button.select();
				else
					button.unselect();
			});
		}

	});
});
