define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/TableViewCell',
	'dojo/text!./templates/RevealRearTableViewCell.html'], 
	
	function(declare, TableViewCell, template) {
	
	return declare('saga.RevealRearTableViewCell', [TableViewCell], {
		
		numberUnread: null,
		
		templateString: template,
		
		constructor: function(args){
			
		},
		
		postCreate: function() {
			this.inherited(arguments);
			if(this.notification) {
				if (this.newItemsNode) {
					this.newItemsNode.innerHTML = this.notification;	
				};				
			} else {
				if (this.newItemsNode) {
					this.newItemsNode.style.display = "none";	
				};
			}
			if(this.imgNode) {
				this.imgNode.src = this.imgSrc;
			} else {
				// this.imgNode.style.display = "none";
			}
		}
		
	});
});
