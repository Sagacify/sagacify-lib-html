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

$.fn.createNameAvatar = function (name, size) {

	// Script by Julien Henrotte
	var canvas = document.createElement('canvas')
	  , ele = this.attr ? this : $(this);

	canvas.width = (size || ele.attr('avatar-size') || ele.width() || 100) | 0;
	canvas.height = (size || ele.attr('avatar-size') || ele.height() || 100) | 0;

	var fontSize = ((canvas.width / 3) | 0) + 'px';

	var firstNameInitiales
	  , lastNameInitiales
	  , initials = '?';

	// Get the initials
	if(name) {
		firstNameInitiales = name.split(/\s+/);
		lastNameInitiales = firstNameInitiales.splice(-1, 1).join('')[0] || '';
		firstNameInitiales = firstNameInitiales.join('')[0] || '';
		initials = firstNameInitiales + lastNameInitiales;
	}

	// Get color from initials and apply color
	var moduloResult = 0;

	if(firstNameInitiales) {
		moduloResult = (initials.charCodeAt(0) + initials.charCodeAt(1)) % 10;
	}
	else if(lastNameInitiales) {
		moduloResult = lastNameInitiales.charCodeAt(0) % 10;
	}

	var colorMod = [
		'#FFD44D',
		'#f05a49',
		'#35bc7a',
		'#59487f',
		'#A85B34',
		'#FD8E20',
		'#1e8bc3',
		'#335E86',
		'#424352',
		'#4d5466'
	];

	canvas.style.background = colorMod[moduloResult];

	var context = canvas.getContext('2d'),
	x = (canvas.width / 2) | 0,
	y = (canvas.height / 2) | 0;
	context.font = '100 ' + fontSize + ' ' + 'Open Sans, Helvetica, Arial';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = 'white';
	context.fillText(initials, x, y);

	ele.attr('src', canvas.toDataURL());
	ele.css('background', colorMod[moduloResult]);

};