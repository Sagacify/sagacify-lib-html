define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/TableViewCell',
	'dojo/text!./templates/RevealRearTableViewHeader.html'], 
	
	function(declare, TableViewCell, template) {
	
	return declare('saga.RevealRearTableViewHeader', [TableViewCell], {
		
		templateString: template,
		
		constructor: function(args){
			
		},
		
		postCreate: function() {
			this.inherited(arguments);
			
		}
	});
});
