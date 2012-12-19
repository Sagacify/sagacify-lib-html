define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/TableViewCell',
	'dojo/text!./templates/RevealRearTableViewUserCell.html'], 
	
	function(declare, TableViewCell, template) {
	
	return declare('saga.RevealRearTableViewCell', [TableViewCell], {
		
		templateString: template,
		
		constructor: function(args){
			
		},
		
		postCreate: function() {
			this.inherited(arguments);
		}
	});
});
