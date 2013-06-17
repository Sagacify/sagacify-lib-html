// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/BreadCrumb.html',
	'dojo/on',
	'dojo/dom-construct',
    'dojo/dom-class',
	'dojo/_base/lang'],

    function(declare, _Widget, template, on, domConstruct, domClass, lang){
         return declare('saga.BreadCrumb', [_Widget], {

			templateString: template,
			
			collection: null,
			
			_id: null,

            light: true,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);

				var me = this;
				/*History.Adapter.bind(window, 'statechange', function(){
        			var stateHash = History.getState().hash;
        			var	route = stateHash.substring(7, stateHash.length);
        			me.route(route);
        		});*/
                if(!this.light)
                    domClass.remove(this.domNode, "light");

        		this.refresh();
         	},
         	
         	refresh: function(){
         		var stateHash = History.getState().hash;
                if(stateHash.charAt(0) == '/')
                    stateHash = stateHash.substring(1, stateHash.length)
        		var	route = stateHash.substring(stateHash.indexOf('/')+1, stateHash.length);
        		this.route(route);
         	},
         	
         	route: function(route){
         		domConstruct.empty(this.domNode);
         		if(route.charAt(route.length-1)=='/')
        			route = route.substring(0, route.length-1);
        		var splitRoute = route.split('/');
        		var me = this;
        		var currentRoute = "/"+routePrefix+"/";
        		dojo.forEach(splitRoute, function(splitRoutePart, i){
        			if(i != splitRoute.length-1){
                        var li = domConstruct.create("li", {}, me.domNode);
        				var link = domConstruct.create("a", {href:"", innerHTML:splitRoutePart}, li);
                    }
        			else{
                        var li = domConstruct.create("li", {innerHTML:splitRoutePart}, me.domNode);
                    }
        			currentRoute += splitRoutePart+"/";
        			var routeToPush = currentRoute;
        			if(i != splitRoute.length-1){
        				on(link, "click", function(evt){
        					evt.preventDefault();
        					History.pushState(null, null, routeToPush);
        				});
        				//domConstruct.create("a", {innerHTML:" > "}, me.domNode);
        			}
        		});
         	}
        
        });
}); 
