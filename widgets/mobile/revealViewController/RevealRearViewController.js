define(['dojo/_base/declare', '../ViewController', './RevealRearTableViewController'], function(declare, ViewController, RevealRearTableViewController) {
	
	return declare('bizComp.RevealRearViewController', [ViewController], {
		
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
