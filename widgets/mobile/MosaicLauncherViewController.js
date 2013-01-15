define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ScrollableViewController',
	'dojo/text!./templates/MosaicLauncherViewController.html',
	'saga/widgets/mobile/MosaicLauncherItem',
	'dojo/on'], 
	
	function(declare, ScrollableViewController, template, MosaicLauncherItem, on) {
	
	return declare('saga.MosaicLauncherViewController', [ScrollableViewController], {
		
		templateString: template,
		
		items: [],
				
		constructor: function(args) {

		},
		
		postCreate: function(){
			this.inherited(arguments);
			for(var i = 0; i < this.numberItems; i++){
				var item = new MosaicLauncherItem(this.itemAtIndex(i));
				this.items.push(item);
				item.placeAt(this.itemContainerNode);
				var me = this;
				on(item.domNode, selectEvent, function(evt){
					me.didSelectItemAtIndex(i);
				});
			}
		},
		
		numberItems: 0,
				
		itemAtIndex: function(index){
			//To be implemented by subclasses
		},
		
		didSelectItemAtIndex: function(index){
			//To be implemented by subclasses
		}
		
	});
});
