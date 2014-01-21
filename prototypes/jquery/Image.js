$.fn.sgJcrop = function(options){
	var me = this;
	this.Jcrop(options, function(){me.jcrop_api = this});
	this.actualImgWidth = me[0].width;
	this.actualImgHeight = me[0].height;
	this.load(function(){
		me.actualImgWidth = me[0].width;
		me.actualImgHeight = me[0].height;
	});
};

$.fn.sgCrop = function(canvas){
	if(!canvas)
		return;
	var generatedCanvas = false;
	if(!$(canvas).is('canvas')){
		var bounds;
		if(canvas instanceof Array){
			bounds = canvas;
		}
		else if(canvas <= 1){
			bounds = [this.actualImgWidth*canvas, this.actualImgHeight*canvas];
		}
		else{
			bounds = [canvas, canvas];
		}
		canvas = document.createElement('canvas');
		canvas.width = bounds[0];
		canvas.height = bounds[1];
		$(canvas).hide();
		$('body').append(canvas);
		generatedCanvas = true;
	}
	canvas = canvas[0]||canvas;
	var context = canvas.getContext("2d");

	var ratioX = this.actualImgWidth/this.width();
	var ratioY = this.actualImgHeight/this.height();
	
	var x = this.jcrop_api.ui.selection.position().left;
	var y = this.jcrop_api.ui.selection.position().top;
	var width = this.jcrop_api.ui.selection.width();
	var height = this.jcrop_api.ui.selection.height();

	context.drawImage(this[0], x*ratioX, y*ratioY, width*ratioX, height*ratioY, 0, 0, $(canvas).width(), $(canvas).height());
	var base64 = canvas.toDataURL('image/jpeg');
	if(generatedCanvas){
		canvas.remove();
	}
	return base64;
};

$.fn.createNameAvatar = function(name, size){
	// Script by Julien Henrotte
	var canvas = document.createElement('canvas');
	canvas.width = size||$(this).attr('avatar-size')||$(this).width()||100;
	canvas.height = size||$(this).attr('avatar-size')||$(this).height()||100;

	var fontSize = canvas.width / 2 + 'px';

	var firstNameInitiales;
	var lastNameInitiales;
	var initiales;
	//Get the initials
	if(name){
		firstNameInitiales = name.split(' ').slice(0, -1).join(' ').charAt(0);
		lastNameInitiales = name.split(' ').slice(-1).join(' ').charAt(0);
		initiales = firstNameInitiales + lastNameInitiales;
	}
	else{
		initiales = "?";
	}

	var moduloResult;
	//get color from initiales and apply color
	if(firstNameInitiales){
		moduloResult = (firstNameInitiales.charCodeAt(0) + lastNameInitiales.charCodeAt(0)) % 10;
	}
	else if(lastNameInitiales){
		moduloResult = lastNameInitiales.charCodeAt(0) % 10;
	}
	else{
		moduloResult = 0;
	}
	var colorMod = ["#FFD213","#cc3333","#4DBA61","#8B2786","#A85B34","#ff6600","#0099cc","#3A4769","#433225","#35384D"];

	canvas.style.background = colorMod[moduloResult];

	var context = canvas.getContext('2d'),
	x = canvas.width / 2,
	y = canvas.height / 2;
	context.font = fontSize + ' ' + "Calibri";
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = 'white';
	context.fillText(initiales, x, y);

	$(this).attr('src', canvas.toDataURL());
	$(this).css('background', colorMod[moduloResult]);
};