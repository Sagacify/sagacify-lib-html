define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojo/text!./templates/Alert.html'], 
	
	function(declare, _Widget, template) {
	
	return declare('saga.Alert', [_Widget], {
		
		templateString: template,
				
		constructor: function(args) {
			
		},	
		
		postCreate: function() {
			this.inherited(arguments);
			
		}
		
	});
});
