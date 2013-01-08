define(['dijit/_Widget', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojo/dom-construct'], 
function(_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, domConstruct) {
	
	return dojo.declare('saga._Widget', [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
			
		templateString: "<div></div>",	
		
		constructor: function(args){

		},
		
		_removeNullDic: function(dic){
			for(key in dic){
				if(!dic[key])
					dic[key] = "";
			}
		},	
		
		_loadCss: function(path, id) {
			var e = document.createElement("link");
			e.href = path;
			e.type = "text/css";
			e.rel = "stylesheet";
			e.media = "screen";
			if(id)
				e.id = id;
			document.getElementsByTagName("head")[0].appendChild(e);
		},
		
		_unloadCss: function(id){
			var el = document.getElementById(id);
			if(el)
				domConstruct.destroy(el);
		},
		
		destroyRecursive: function() {
			/*dojo.forEach(dijit.findWidgets(this.domNode), function(widget){
            	widget.destroyRecursive();
        	});*/
			this.inherited(arguments);
		}
		
	});
		
});
