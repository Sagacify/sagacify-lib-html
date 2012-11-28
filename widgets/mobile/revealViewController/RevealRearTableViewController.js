define(['dojo/_base/declare', '../TableViewController', './RevealRearTableViewCell'], function(declare, TableViewController, RevealRearTableViewCell) {
	
	return declare('saga.RevealRearTableViewController', [TableViewController], {
			
		constructor: function(args){
			this.parent = args.parent;
		},
		
		postCreate: function() {
			this.inherited(arguments);
		},
		
		numberOfSections: 1,
		
		numberOfRowsInSection: function(section) {
			var revealView = this.parent.parent;
			return revealView.viewControllers.length;
		},
		
		
		viewForHeaderInSection: function(section) {
			return null;
		},
		
		cellForRowAtIndexPath: function(indexPath) {
			var revealView = this.parent.parent;
			var rrtvc = new RevealRearTableViewCell({label:revealView.viewControllers[indexPath.row].name});
			return rrtvc;
		},
		
		didSelectRowAtIndexPath: function(indexPath) {
			var revealView = this.parent.parent;
			revealView.setCurrentFrontViewController(revealView.revealFrontViewControllers[indexPath.row]);
			revealView.revealStart();
		}
	});
});