define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojo/text!./templates/Alert.html',
	'dojo/on'], 
	
	function(declare, _Widget, template, on) {
	
	return declare('saga.Alert', [_Widget], {
		
		templateString: template,
		
		title: "",
		
		message: "",
				
		constructor: function(args) {
			
		},	
		
		postCreate: function() {
			this.inherited(arguments);
			on(this.closeNode, "click", function(evt){
				evt.preventDefault();
			});
		}
		
	});
});
