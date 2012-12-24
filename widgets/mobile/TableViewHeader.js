define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget', 
	'dojo/text!./templates/TableViewHeader.html'], 
	
	function(declare, _Widget, template) {
	
	return declare('saga.TableViewHeader', [_Widget], {
		
		templateString: template,
		
		constructor: function(args) {
			
		},
		
		postCreate: function() {
			
		},

	});
});
