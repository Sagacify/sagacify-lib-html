define(['dijit/_Widget', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin'], 
function(_Widget, _TemplatedMixin, _WidgetsInTemplateMixin) {
	
	return dojo.declare('bizComp._Widget', [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
			
		templateString: "<div></div>",	
		
		constructor: function(args){
			
		},
		
		
		_loadCss: function(path) {
			var e = document.createElement("link");
			e.href = path;
			e.type = "text/css";
			e.rel = "stylesheet";
			e.media = "screen";
			document.getElementsByTagName("head")[0].appendChild(e);
		},
		
		destroyRecursive: function() {
			dojo.forEach(dijit.findWidgets(this.domNode), function(widget){
            	widget.destroyRecursive();
        	});
			this.inherited(arguments);
		}
		
	});
		
});
