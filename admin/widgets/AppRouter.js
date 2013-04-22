// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/AdminRouter.html',
	'./Database/Database',
	'./Collection/Collection',
	'./Document/DocumentRouter',
	'dojo/on',
	'dojo/dom-construct',
	'admin/stores/AdminStore'],

    function(declare, _Widget, template, Database, Collection, DocumentRouter, on, domConstruct, AdminStore){
    return declare('admin.AdminRouter', [_Widget], {

		templateString: template,
		
		_subController: null,
    	        	        	             	
    	constructor : function(args) {

    	},
    	
    	postCreate : function() {
			this.inherited(arguments);
      	},
    	
		route: function(route) {
			var splitRoute = route.split('/');
			
			if(splitRoute.length == 1){
				if(this._subController)
					this._subController.destroyRecursive();
				var database = new Database();
				database.placeAt(this.bodyNode);
				this._subController = database;
			}       		 
			else if(splitRoute.length == 2){
				if(this._subController)
					this._subController.destroyRecursive();
				var collection = new Collection({name:splitRoute[1]});
				collection.placeAt(this.bodyNode);
				this._subController = collection;
			}
			else if(splitRoute.length >= 3){
				if(!(this._subController instanceof DocumentRouter) || (this._subController._id && this._subController._id != splitRoute[2]) || (!this._subController._id && splitRoute[2] != "new")){
					if(this._subController)
						this._subController.destroyRecursive();
					this._subController = new DocumentRouter({collection:splitRoute[1], _id:splitRoute[2]!="new"?splitRoute[2]:null});
					this._subController.placeAt(this.bodyNode);
				}
				var subroute = route.substring(splitRoute[0].length+splitRoute[1].length+splitRoute[2].length+3, route.length);
				this._subController.route(subroute);
			}
		}
        	
    });
}); 
