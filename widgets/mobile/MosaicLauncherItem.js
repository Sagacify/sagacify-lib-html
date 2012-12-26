define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojo/text!./templates/MosaicLauncherItem.html',
	'dojo/on'], 
	
	function(declare, _Widget, template, on) {
	
	return declare('saga.MosaicLauncherItem', [_Widget], {
		
		templateString: template,
				
		constructor: function(args) {

		},
		
		postCreate: function(){
			this.inherited(arguments);	
			on(this.linkNode, "click", function(evt){
				evt.preventDefault();
			});
		}
		
	});
});
