// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/Database.html',
	'./DatabaseHeader',
	'admin/widgets/Collection/Collection',
	'dojo/on',
	'dojo/dom-construct',
	'admin/stores/AdminStore'],

    function(declare, _Widget, template, DatabaseHeader, Collection, on, domConstruct, AdminStore){
    return declare('admin.Database', [_Widget], {

		templateString: template,
    	        	        	             	
    	constructor : function(args) {

    	},
    	
    	postCreate : function() {
			this.inherited(arguments);
			var adminStore = AdminStore.singleton();
			var me = this;
			adminStore.getCollections().then(function(result){
				console.log(result);	
				dojo.forEach(result.object, function(name, i){
					var header = new DatabaseHeader({name:name});
					header.placeAt(me.databaseNode);
					on(header.domNode, "click", function(evt){
						History.pushState(null, null, "/admin/collections/"+name);
					});
				});
			}, function(error){
				console.log(error);
			});
      	},
    	
		route: function(route) {
			      		 
		}
        	
    });
}); 
