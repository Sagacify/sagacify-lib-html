define([
	'./Layout',
	'text!./ImageCropper.html'
], function (Layout, Template) {

	'use strict';

	return Layout.extend({

		token: null,

		template: Template,

		regions: {

		},

		ui: {
			imgToCrop: '[data-ui=imgToCrop]'
		},

		events: {

		},

		initialize: function (options) {

		},

		onRender: function () {
			var jcrop_api;
			this.ui.imgToCrop.Jcrop({
			    onChange: function(){},
			    onSelect: function(){},
			    bgFade: true,
			    bgOpacity: .2,
			    setSelect: [ 0, 0, 220, 220 ],
			    aspectRatio: 1
			},function(){
			    jcrop_api = this;
			});
		},

		onClose: function () {

		}

	});

});