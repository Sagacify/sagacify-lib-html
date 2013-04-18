define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/InputImage.html',
	'saga/utils/Utils',
	'dojo/io/iframe',
	'dojo/on',
	'admin/stores/UrlManager'],

    function(declare, _Widget, template, Utils, iframe, on, UrlManager){
         return declare('admin.InputImage', [_Widget], {

			templateString: template,
			
			image: null,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				var me = this;
				
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
							for(var key in result.image){
         						me.image[key] = result.image[key];
         					}
			         		me.imgNode.style.display = "";
			         		me.imgNode.src = result.image.path;
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
         	},
         	
         	getValue: function(){
         		return this.image;
         	},
         	
         	setValue: function(value){
         		this.image = value;
         		if(value && value.path){
         			//this.uploadButton.style.display = "none";
         			this.imgNode.style.display = "";
         			this.imgNode.src = value.path;
         		}
         	},
         	
         	setReadOnly: function(readOnly){
				this.inputNode.readOnly = readOnly;
         	},
         	
         	onChange: function(){
         		
         	}
        	
        });
}); 
