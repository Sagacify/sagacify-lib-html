define(['dojo/_base/declare', 'saga/widgets/mobile/ViewController', 'saga/widgets/mobile/revealViewController/RevealRearTableViewController'], function(declare, ViewController, RevealRearTableViewController) {
	
	return declare('saga.RevealRearViewController', [ViewController], {
		
		viewControllers: null,
		
		revealRearTableViewController: null,
		
		constructor: function(args) {
			this.viewControllers = args.viewControllers;
			this.parent = args.parent;
		},		
		
		postCreate: function() {
			
			this.domNode.style.width = "320px";
			this.domNode.style.height = "460px";
			this.domNode.style.background = "gray";
			
			this.revealRearTableViewController = new RevealRearTableViewController({parent:this, frame:this.frame});
			this.revealRearTableViewController.placeAt(this.domNode);
			this.revealRearTableViewController.startup();

		}
	});
});
