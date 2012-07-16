define(['dojo', 'dojox/mobile/Heading', './TextView', 'dojo/dom-construct'], function(dojo, Heading, TextView, domConstruct) {
	
	return dojo.declare('bizComp.mobile.SearchBar', [Heading], {

		width: 300,

		constructor: function(args) {
			if(args) {
				if(args.width)
					this.width = args.width;
			}
		},		
		
		postCreate: function() {
			this.inherited(arguments);
			var div = domConstruct.create("div", {style:"position:absolute;border:1px solid black;background:white;top:5px;left:6px;width:"+(this.width-6)+"px;height:30px;border-radius:25px;-moz-border-radius:25px;"}, this.domNode)
			
			var textView = new TextView({placeholder:"Search", style:"position:absolute;left:25px;top:2px;width:"+(this.width-66)+"px;height:22px;font-size:70%;"});
			textView.placeAt(div);
		},
		
	});
});
