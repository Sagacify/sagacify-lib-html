// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare', 
	'dojo/_base/array',
	'dojo/on', 
	'saga/widgets/_Widget',
	'./AdminRouter',
	'./Auth/Login',
	'./Auth/Register',
	'dojo/text!./templates/Application.html',
	'admin/stores/AdminStore'],

    function(declare, array, on, _Widget, AdminRouter, Login, Register, template, AdminStore){
         return declare('admin.Application', [_Widget], {

			templateString: template,
        	        	        	     
        	_subController : null,
        	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {

        		localStorage.defaultLanguage = "en";
        		
	       		var me = this;
        		History = window.History;
        		History.Adapter.bind(window, 'statechange', function(){
        			var stateHash = History.getState().hash;
        			var	route = stateHash.substring(7, stateHash.length);
        			me.route(route);
        		});
        		var stateHash = History.getState().hash;
        		var	route = stateHash.substring(7, stateHash.length);
        		this.route(route);

          	},
        	
        	route: function(route) {
        		if(route.charAt(route.length-1)=='/')
        			route = route.substring(0, route.length-1);
        		console.log("route: " + route);
        	       		
        		var splitRoute = route.split('/');						
    			switch (splitRoute[0])
    			{
    				case "collections":
    					if(!(this._subController instanceof AdminRouter)){
    						if(this._subController)
    							this._subController.destroyRecursive();
							var adminRouter = new AdminRouter();
							this._subController = adminRouter;
							adminRouter.placeAt(this.domNode);
    					}
    					this._subController.route(route);
    					//this._subController.route(route.substring(route.indexOf('/')+1, route.length));
    					break;
    				case "register":
	    				if(this._subController){
    						this._subController.destroyRecursive();
    					}
    					var accountCreation = new AccountCreation();
    					this._subController = accountCreation;
    					accountCreation.placeAt(this.domNode);
    					break;
    				case "login":
    					if(this._subController){
    						this._subController.destroyRecursive();
    					}
    					var login = new Login();
						this._subController = login;
						login.placeAt(this.domNode);
						break;
    				default:
    					History.pushState(null, null, "/admin/collections");
    			}
        	}
        	
        });
}); 
