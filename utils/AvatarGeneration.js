define([
	'dojo/_base/declare',
	'dojo/dom-construct'
	],
	function(declare, domConstruct){
		return declare("AvatarGeneration", null, {

			//create all canvas
		createAvatar : function (theCanvas, widthCanvas, heightCanvas, fontFamily, fullName){
			// Script by Julien Henrotte
			//Get the canvas, width + height)
			var canvas = domConstruct.create('canvas');
			// console.log('FULLNAME -> ' + fullName);
			var getName = fullName;
			canvas.width = widthCanvas;
			canvas.height = heightCanvas;
			//Get the fonsize, based on canvas width
			var fontSize = canvas.width / 2 + 'px';

			//Get the initials
			var firstNameInitiales = getName.split(' ').slice(0, -1).join(' ').charAt(0);
			var lastNameInitiales = getName.split(' ').slice(-1).join(' ').charAt(0);
			var initiales = firstNameInitiales + lastNameInitiales;

			//get color from initiales and apply color
			if(firstNameInitiales){
				var moduloResult = (firstNameInitiales.charCodeAt(0) + lastNameInitiales.charCodeAt(0)) % 10;
			}
			else {
				var moduloResult = lastNameInitiales.charCodeAt(0) % 10;
			}
			var colorMod = ["#FFD213","#cc3333","#4DBA61","#8B2786","#A85B34","#ff6600","#0099cc","#3A4769","#433225","#35384D"];

			canvas.style.background = colorMod[moduloResult];


			//Font + positionnement
			var context = canvas.getContext('2d'),
			x = canvas.width / 2,
			y = canvas.height / 2;
			context.font = fontSize + ' ' + fontFamily;
			//Align horizontal
			context.textAlign = 'center';
			//Aligne vertical
			context.textBaseline = 'middle';
			//Text color
			context.fillStyle = 'white';
			//Construct canvas
			context.fillText(initiales, x, y);

			// console.log(canvas);
			//debugger;

			//domConstruct.place(canvas, 'last', theCanvas);*/

			return [canvas, colorMod[moduloResult]];
		}

	});
});