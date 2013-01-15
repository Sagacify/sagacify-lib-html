define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojo/text!./templates/PhotoMosaicItem.html',
	'dojo/dom-construct',
	'dojo/on'], 
	
	function(declare, _Widget, template, domConstruct, on) {
	
	return declare('saga.PhotoMosaicItem', [_Widget], {
		
		templateString: template,
		
		src: null,
		
		constructor: function(args) {

		},
		
		postCreate: function(){
			this.inherited(arguments);	
        	on(this.linkNode, selectEvent, function(evt){
        		evt.preventDefault();
        	});
        	this.imgNode.src = this.src;
		}
		
	});
});
