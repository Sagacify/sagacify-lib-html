define(['dojo/_base/declare', 'saga/widgets/_Widget', './RevealRearTableViewController'], function(declare, _Widget, RevealRearTableViewController) {
	
	return declare('saga.RevealRearViewController', [_Widget], {
		
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
			
			this.revealRearTableViewController = new RevealRearTableViewController({parent:this, style:"width:320px;height:460px;"});
			this.revealRearTableViewController.placeAt(this.domNode);
			this.revealRearTableViewController.load();
		}
			
	});
});
