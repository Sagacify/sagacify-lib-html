define(['dojo', 'bizComp/_Widget', './RevealRearTableView'], function(dojo, _Widget, RevealRearTableView) {
	
	return dojo.declare('bizComp.RevealRearView', [_Widget], {
		
		viewControllers: null,
		
		revealRearTableView: null,
		
		constructor: function(args) {
			this.viewControllers = args.viewControllers;
			this.parent = args.parent;
		},		
		
		postCreate: function() {
			this.domNode.style.width = "320px";
			this.domNode.style.height = "460px";
			this.domNode.style.background = "gray";
			
			this.revealRearTableView = new RevealRearTableView({parent:this, style:"width:320px;height:460px;"});
			this.revealRearTableView.placeAt(this.domNode);
			this.revealRearTableView.load();
		},
			
	});
});
