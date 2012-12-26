define([
	'dojo/_base/declare',
	'saga/widgets/_Widget',
	'dojo/on',
	'dojo/text!./templates/ImageUploader.html',
	'saga/utils/AndroidFix'], 

	function(declare, _Widget, on, template, AndroidFix) {
		return declare('i4.ImageUploader', [_Widget], {
			
			imageStore: null,
			
			templateString : template,
			
			label: "Profile picture",
			
			image: null,

			constructor: function(args) {

			},
			
			postCreate: function() {
				this.inherited(arguments);

				if(this.image)
					this.setImage(this.image);

				var me = this;
				
				var postImageProcess = function(image){
					$('.popover').fadeTo(200,0);
					me.setImage(image);
					me.onImageUpload.apply(me, [image]);
				}
				
				on(this.libraryButton, "click", function(evt){
					evt.preventDefault();
					me.uploadImage("Library", function(err, image){
						if(!err){
							postImageProcess(image);
						}
					});
				});
				
				on(this.cameraButton, "click", function(evt){
					evt.preventDefault();
					me.uploadImage("Camera", function(err, image){
						if(!err){
							postImageProcess(image);
						}
					});
				});
				
				$('button.uploadButton').live('click',function(e){
	                e.preventDefault();
	                $('.popover').fadeTo(200,1);
	            })
	            AndroidFix.simulateClick(this.uploadButton);
	            $('#imageFigure').live('click',function(e){
	                e.preventDefault();
	                $('.popover').fadeTo(200,1);
	            })
	            AndroidFix.simulateClick(this.imageFigureNode);
	            $('button.cancel').live('click',function(e){
	                e.preventDefault();
	                $('.popover').fadeTo(200,0);
	            })
	
			},
			
			uploadImage: function(device, callback) {
	    		function onSuccess(img64) {
					return this.imageStore.createImage({type:"base64", img:img64}).then(function(image){
						callback(null, image);
					}, function(error){
						callback(error);
					});
				}
				
				function onFail(message) {
				    alert('Failed because: ' + message);
				}
				
				//var img64 = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH3AkZEhMU7b7uYQAAA9hJREFUSMeVll1uHEUUhb97qx0EOInj2AogwwMI3pDghQc2QHaAxCaQiPgxkZBAYgushWwg2+ABCUXYnontGf/MTN3LQ1V11/R028ZSy21Z1afOV6dOlXz551dfAE+Ag4f7j//YunePZmuL0CgguBlxFVkuFkxe/fsc+Bs4Bi5IP28D+9qET3f2Hz9LYxtEBHcnrlasFkumr45+cfwv4B/gSIHL/JHZ2dHkNzPD3XB3AEQEUUGD8mBv93fgfn62q9/b2zsPnwVVVBXJM8IdN8fMcPws61wB101+uQDmjr+2GDELqCkSHKSIp49msWsg5M+/BdzXoKCKiIBIEvUkamYA82zyClg0wCL/cQnMzQy37NgBEUQEFUVDQJBHji+ApgiHEN4JGjpR0tDyrbPjyc/ZXOtY8+yvWtzHk+dpgG/gDkHZebL3I7BTPw/2dr/VMI65J7oAlg2wzOJlrecWDWsMdUXIuFVRDWhwsuAbWeLNEAIyijnWmK/zs2qA1SbuiEXDg+OeHQtoUAIBQfYcnwGI6sPQBKSg3sA8LZjL+i6BpVbC18Xx2fH00Eso1nArIQT2P3jvG2AX2N0/ePdrbQIapBW+DTMQGyD2XF8A82iRYA3ujri3KD3NAuARQJP3LK2otUkewLzIWlaEl31hi2mgmSbR4jqENBGRXRGREAIlUWZpadz9JswrICpgWbwWnp2fTH+wOJRuRYPy/icffX7w8YefaUgTI+fgLpgBb3IWhlzPCjI1h1wmWmGVPBjPiLPbEcytW8C1El5V22qeK/RXs9hVqJObLLtUTe+yvndHMLfr+/LpC9eXT194xr3q7em546dprZOwU5CXLSZdpsh7120Mc+uWqvZq8eEKtew4Qxa6Pdu6zaG6AbOVIQqQXQ+uc6nQ9VOrlUte66aKt2NuhVtWnfhGhSYnnUhOVCVa3N6OuUZNKuUx3JEauWu3xbwK1MAROIh5zfFIyNoKLSGrT67u6f5XHYGjmNcddyEbbLJUoWmdzQ0sxSuVRXYc74Z5TNiGutti+rBFQ9VxDJfuFPo/mNfDtY57pEJj20olwe2BEO+Oecgxt1ZoNEyNcjJ4NYG7Yt5w3BMertAYqZ9YvfcvdGOYB4UH0t26dvw0WiRGy2Kd27OT6WGFeVGvbx/zGOo6ZLG6nVwBFxYNV8PaM9iK2xrxIo8ddDuG+ibXl+cn08OY72S2vr59xKubhMccg2NIu9ZF/BK48GhYDpeZcT55/X3velMO/EHMNwt3Fbrh3My6i3vn9rqX5FG3o6iTFe8nvD08ZtPT70pxzCanP/WvrncR/g+C2CxrubSsZQAAAABJRU5ErkJggg==";			 		
				//onSuccess(img64)
				//return;
					
				if(device == "Library"){
					navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
					    destinationType: Camera.DestinationType.DATA_URL,
					    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					    allowEdit: true
					});
				}
				else{
					navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
					    destinationType: Camera.DestinationType.DATA_URL,
					    allowEdit: true
					});
				}
    		},
    		
    		setImage: function(image){
    			if(image && image.path){
    				this.uploadButton.style.display = "none";
    				this.imageContainerNode.style.display = "";
    				this.domNode.style.paddingBottom = "0px";
					this.imageNode.src = localStorage.serverPath+image.path;	
    			}
    		},
    		
    		onImageUpload: function(){
    			
    		}
	});
});
;
