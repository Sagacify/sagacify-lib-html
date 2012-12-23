define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ScrollableViewController',
	'dojo/text!./templates/PhotoMosaicViewController.html',
	'saga/widgets/mobile/PhotoMosaicItem',
	'saga/widgets/mobile/PhotoViewController',
	'dojo/dom-construct',
	'dojo/on'], 
	
	function(declare, ScrollableViewController, template, PhotoMosaicItem, PhotoViewController, domConstruct, on) {
	
	return declare('saga.PhotoMosaicViewController', [ScrollableViewController], {
		
		templateString: template,
		
		images: null,
		
		photoPresentation: "push",
		
		constructor: function(args) {

		},
		
		postCreate: function(){
			this.inherited(arguments);	
			var me = this;
        	dojo.forEach(this.images, function(image, i){
        		var photoMosaicItem = new PhotoMosaicItem({src:image.src?image.src:image});
        		photoMosaicItem.placeAt(me.photoContainerNode);
        		on(photoMosaicItem.domNode, "click", function(evt){
        			var photoViewController = new PhotoViewController({frame:me.frame, images:me.images, indexToShow:i});
        			if(me.photoPresentation == "push"){
        				me.navigationController.pushViewController(photoViewController);
        				Window.revealViewController.enableSwipe(false);
        				on(me.navigationController.navigationBar.backButton, "click", function(evt){
        					Window.revealViewController.enableSwipe(true);	
        				});
        			}
        		});
        	});
		},
		
	});
});
