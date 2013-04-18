define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/File.html',
	'saga/utils/Utils',
	'dojo/io/iframe',
	'dojo/on',
	'admin/stores/UrlManager',
	'admin/stores/AdminStore'],

    function(declare, _Widget, template, Utils, iframe, on, UrlManager, AdminStore){
         return declare('admin.File', [_Widget], {

			templateString: template,
			
			_id: null,
			
			doc: null,
			
			schema: null,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				var me = this;
				
				var adminStore = AdminStore.singleton();

				on(this.uploadButton, "click", function(evt){
					Utils.simulateClick(me.inputNode);
				});

				on(this.inputNode, "change", function(evt){
					iframe.send({
							url : UrlManager.createFile(),
							headers: {Authorization:"bearer "+localStorage.access_token, Accept:"application/javascript, application/json"},
							form : me.dropFileFormNode,
							handleAs: "json"
					}).then(function(file){
						if(file){
							History.pushState(null, null, "/admin/collections/files/"+file._id);
						}
						else {
							console.log('Raise Error : No path returned');
						}
					},
					function(error, ioArgs){
						console.log('Raise Error : Server side error');
						console.log(error);
					}); 		
				});
				
				on(this.cancelButton, "click", function(evt){
					History.back();
				});
         	},
         	
         	onChange: function(){
         		
         	}
        	
    	});
}); 
