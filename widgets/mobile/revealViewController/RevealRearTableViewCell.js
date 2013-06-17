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

			this.updateNotification(this.notification);

			if(this.imgNode) {
				this.imgNode.src = this.imgSrc;
			} else {
				// this.imgNode.style.display = "none";
			}
		}, 

		updateNotification: function(notif){
			if(notif) {
				if (this.newItemsNode) {
					this.newItemsNode.style.display = "";
					this.newItemsNode.innerHTML = notif;	
				};				
			} else {
				if (this.newItemsNode) {
					this.newItemsNode.style.display = "none";	
					this.newItemsNode.innerHTML = "";
				};
			}
		}
	});
});
