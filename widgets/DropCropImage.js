define([
	'saga/widgets/_Widget', 
	'dojo/text!./templates/DropCropImage.html',
	'dojo/on',
	'dojo/dom-construct', 
	'dojo/_base/lang',
	'dojo/io/iframe'],
	function(_Widget, template, on, domConstruct, lang, iframe) {

	dojo.declare('saga.DropCropImage', [_Widget], {

		templateString: template,
		
		constructor: function(args){

		},
		
		postCreate: function() {
			this.inherited(arguments);
			var me = this;
			
			$(document).on("change", "input[type=file]", function() {
				var imageIo = $(this).siblings('img');
				imageIo.attr('src','');
				imageIo.renderImage(this.files[0]);
				$('button').show();
				$(this).hide();
			})

			$(document).on('click', 'button',function(){
				me.generateImage($(this).siblings('img'), 100, 100);
			});
		},

		generateImage: function(actualImage, dataWidth ,dataHeight){
			//Data from jCrop
			var fromLeft = $('#x1').val(),
			fromTop    = $('#y1').val(),
			cropWidth  = $('#w').val(),
			cropHeight = $('#h').val();

			//Get size data
			var canvasWidth = $('canvas').width(), canvasHeight = $('canvas').height(),
			imgWidth = actualImage.width(), imgHeight = actualImage.height();

			var ratioWidth = canvasWidth / imgWidth, ratioHeight = canvasHeight / imgHeight;

			//Generate the base64
			canvasBis = document.createElement("canvas");
			ctx3 = canvasBis.getContext("2d");
			ctx3.canvas.width = dataWidth;
			ctx3.canvas.height = dataHeight;
			ctx3.drawImage(actualImage.get(0), fromLeft * ratioWidth, fromTop * ratioHeight, cropWidth * ratioWidth, cropHeight * ratioHeight, 0, 0, dataWidth, dataHeight);
			canvasBis = canvasBis.toDataURL('image/jpeg', .7);
			actualImage.attr("src",canvasBis);
			actualImage.siblings('.jcrop-holder, canvas').remove();
			//actualImage.show().css({"visibility" : "visible","width" : "auto", "height" : "auto"});
			actualImage.attr('width', dataWidth);
			uploadData(actualImage);
		}
		
		
	});

	// update info by cropping (onChange and onSelect events handler)
	updateInfo = function(e) {
	    $('#x1').val(e.x);
	    $('#y1').val(e.y);
	    $('#w').val(e.w);
	    $('#h').val(e.h);
	};

	// clear info by cropping (onRelease event handler)
	clearInfo = function() {
	    $('#w').val('');
	    $('#h').val('');
	};

	uploadData = function(base64Image){
		console.log(base64Image.attr('src'));
	};

	croppingBaby = function(element){
		// Create variables (in this scope) to hold the Jcrop API and image size
	    var jcrop_api, boundx, boundy;

	    // destroy Jcrop if it is existed
	    if (typeof jcrop_api != 'undefined') 
	        jcrop_api.destroy();

	    // initialize Jcrop
	    element.Jcrop({
	        minSize: [100, 100], // min crop size
	        aspectRatio : 1, // keep aspect ratio 1:1
	        bgFade: false, // use fade effect
	        bgOpacity: .4, // fade opacity
	        setSelect: [ 100, 100, 50, 50 ],
	        onChange: updateInfo,
	        onSelect: updateInfo,
	        onRelease: clearInfo
	    }, function(){

	        // use the Jcrop API to get the real image size
	        var bounds = this.getBounds();
	        boundx = bounds[0];
	        boundy = bounds[1];

	        // Store the Jcrop API in the jcrop_api variable
	        jcrop_api = this;
	    });
	};

	return saga.DropCropImage;

});	