define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/Image.html',
	'saga/utils/Utils',
	'dojo/io/iframe',
	'dojo/on',
	'admin/stores/UrlManager',
	'admin/stores/AdminStore'],

    function(declare, _Widget, template, Utils, iframe, on, UrlManager, AdminStore){
         return declare('admin.Image', [_Widget], {

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
							url : UrlManager.createImage(),
							headers: {Authorization:"bearer "+localStorage.access_token, Accept:"application/javascript, application/json"},
							form : me.dropImageFormNode,
							handleAs: "json"
					}).then(function(result){
						if(result){
							me.onChange(result.image);
							me.doc.devImage = result.image;
			         		me.imgNode.style.display = "";
			         		me.imgNode.src = me.doc.devImage.path;
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
				
				if(this._id){
					this.uploadButton.style.display = "none";
					this.imgNode.style.display = "";
					this.imgNode.src = this.doc.devImage.path;
				}
				
				if(!this._id){
					this.deleteButton.style.display = "none";
				}
				else{
					on(this.deleteButton, "click", function(evt){
						adminStore.deleteDocument("images", me._id).then(function(result){
							console.log(result);
							History.pushState(null, null, "/admin/collections/images");
						}, function(error){
							console.log(error);
						});
					});	
				}
				
				on(this.cancelButton, "click", function(evt){
					History.back();
				});
         	},
         	
         	onChange: function(){
         		
         	}
        	
    	});
}); 
