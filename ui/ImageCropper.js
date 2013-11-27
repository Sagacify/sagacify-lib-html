define([
	'./Layout',
	'text!./ImageCropper.html'
], function (Layout, Template) {

	'use strict';

	return Layout.extend({

		actualImgSize: {
			width: null,
			height: null
		},

		template: Template,

		regions: {

		},

		ui: {
			img: '[data-ui=img]',
			canvas: '[data-ui=canvas]'
		},

		events: {

		},

		initialize: function (options) {
			this._defineProperties();
		},

		onRender: function () {
			var me = this;
			if(this.options.src){
				debugger
				this.src = this.options.src;
			}
			this.ui.img.Jcrop(this.options.jcrop, function(){me.jcrop_api = this});
			this.ui.img.on('load', function(){
				me.actualImgSize.width = this.width;
				me.actualImgSize.height = this.height;
			});
			// this.$el.css('width', 300);
			// this.$el.css('height', 300);
		},

		crop: function(){
		    var context = this.ui.canvas[0].getContext("2d");

		    var ratioX = this.actualImgSize.width/this.ui.img.width();
		    var ratioY = this.actualImgSize.height/this.ui.img.height();
		    
		    var x = this.jcrop_api.ui.selection.position().left;
		    var y = this.jcrop_api.ui.selection.position().top;
		    var width = this.jcrop_api.ui.selection.width();
		    var height = this.jcrop_api.ui.selection.height();

		    context.drawImage(this.ui.img[0], x*ratioX, y*ratioY, width*ratioX, height*ratioY, 0, 0, this.ui.canvas.width(), this.ui.canvas.height());

		    this.ui.img.hide();
		    $('.jcrop-holder', this.$el).hide();
		    this.ui.canvas.show();
		},

		_defineProperties: function(){
			Object.defineProperty(this, "src", {
		        get: function () {
		            return this.ui.img.attr('src');
		        },
		        set: function(src){
		        	console.log(src)
		        	//this.jcrop_api.setImage(src);
					this.ui.img.attr('src', src);
		        }
		    });

			Object.defineProperty(this, "base64", {
		        get: function () {
		            return this.ui.canvas[0].toDataURL();
		        }
		    });
		},

		onClose: function () {

		}

	});

});