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

		imgNode: null,

		inputNode: null,

		cropButtonNode: null,

		cancelButtonNode: null,
		
		constructor: function(args){

		},
		
		postCreate: function() {
			this.inherited(arguments);
			var me = this;

			
			// $(document).on("change", "input[type=file]", function() {
			// 	//var imageIo = $(this).siblings('img');
			// 	var imageIo = $(me.imgNode);
			// 	imageIo.attr('src','');
			// 	debugger
			// 	imageIo.renderImage(this.files[0]);
			// 	//$('button').show();
			// 	//$(this).hide();
			// })

			// $(document).on('click', 'button',function(){
			// 	//me.generateImage($(this).siblings('img'), 100, 100);
			// 	me.generateImage($(me.imgNode), 100, 100);
			// });

			this.initWidth = $(this.imgNode).css('width');
			this.initHeight = $(this.imgNode).css('height');
			if(this.initHeight == "0px")
				this.initHeight = "auto";
			this.initBorderRadius = $(this.imgNode).css('borderRadius');

			on(this.inputNode, "change", function(evt){
				if(this.files[0]){
					me.prevSource = me.imgNode.src;
					var imageIo = $(me.imgNode);
					var cssAttr = {
						width: me.initWidth,
						height:me.initHeight
					};
					if(imageIo.css("borderRadius")){
						cssAttr.borderRadius = "0px";
					}
					$(me.imgNode).css(cssAttr);
					imageIo.attr('src','');
					imageIo.renderImage(this.files[0]);
					me.cropButtonNode.style.display = "";
					me.cancelButtonNode.style.display = "";
				}
			});

			if(this.cropButtonNode){
				on(this.cropButtonNode, "click", function(evt){
					evt.preventDefault();
					me.generateImage($(me.imgNode), 100, 100);
				});
			}

			if(this.cancelButtonNode){
				on(this.cancelButtonNode, "click", function(evt){
					evt.preventDefault();
					me.reinit();
					me.imgNode.src = me.prevSource;	
				});
			}
		},

		generateImage: function(actualImage, dataWidth, dataHeight){
			//Data from jCrop
			var fromLeft = $('#x1').val(),
			fromTop    = $('#y1').val(),
			cropWidth  = $('#w').val(),
			cropHeight = $('#h').val();

			//Get size data
			var canvasWidth = $(this.imgNode).siblings('canvas').width(), canvasHeight = $(this.imgNode).siblings('canvas').height(),
			imgWidth = actualImage.width(), imgHeight = actualImage.height();

			var ratioWidth = canvasWidth / imgWidth, ratioHeight = canvasHeight / imgHeight;

			//Generate the base64
			canvasBis = document.createElement("canvas");
			ctx3 = canvasBis.getContext("2d");
			ctx3.canvas.width = dataWidth;
			ctx3.canvas.height = dataHeight;
			ctx3.drawImage(actualImage.get(0), fromLeft * ratioWidth, fromTop * ratioHeight, cropWidth * ratioWidth, cropHeight * ratioHeight, 0, 0, dataWidth, dataHeight);
			canvasBis = canvasBis.toDataURL('image/png', .7);
			$(this.imgNode).attr("src", canvasBis);

			var base64 = actualImage.attr('src').split(',')[1];
			var me = this;
			this.uploadData(base64, function(){
				me.reinit();
			});
		},

		reinit: function(){
			var cssAttr = {visibility : "visible", width:this.initWidth, height:this.initHeight, borderRadius:this.initBorderRadius};
			$(this.imgNode).show().css(cssAttr);
         	$(this.imgNode).siblings('.jcrop-holder, canvas').remove();
         	this.cropButtonNode.style.display = "none";
         	this.cancelButtonNode.style.display = "none";
         	this.inputNode.value = null;
		},

		uploadData: function(base64Image){
			console.log(base64Image);
		}
		
		
	});

	croppingBaby = function(element){
		var me = this;

		// update info by cropping (onChange and onSelect events handler)
		var updateInfo = function(e) {
		    $('#x1').val(e.x);
		    $('#y1').val(e.y);
		    $('#w').val(e.w);
		    $('#h').val(e.h);
		};

		// clear info by cropping (onRelease event handler)
		var clearInfo = function() {
		    $('#w').val('');
		    $('#h').val('');
		};

		// Create variables (in this scope) to hold the Jcrop API and image size
	    var boundx, boundy;

	    if(this.jcrop_api){
	    	this.jcrop_api.destroy();
	    }

	    var borderSize = 20;
	    if(element.width() < (100+2*borderSize) || element.height() < (100+2*borderSize))
	    	borderSize = 3;
	    var size = Math.min(element.width()-2*borderSize, element.height()-2*borderSize);
	    var x = (element.width()-size)/2;
	    var y = (element.height()-size)/2;

    	element.Jcrop({
	        minSize: [100, 100], // min crop size
	        aspectRatio : 1, // keep aspect ratio 1:1
	        bgFade: false, // use fade effect
	        bgOpacity: .4, // fade opacity
	        setSelect: [ x, y, x+size, y+size],
	        onChange: updateInfo,
	        onSelect: updateInfo,
	        onRelease: clearInfo
	    }, function(){
	        // use the Jcrop API to get the real image size
	        var bounds = this.getBounds();
	        boundx = bounds[0];
	        boundy = bounds[1];

	        // Store the Jcrop API in the jcrop_api variable
	        me.jcrop_api = this;
	    });
	};

	return saga.DropCropImage;

});	