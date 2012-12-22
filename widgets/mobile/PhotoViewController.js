define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ViewController',
	'dojox/mobile/View',
	'dojox/mobile/SwapView',
	'dojox/mobile/PageIndicator',
	'dojo/dom-construct',
	'dojo/on'], 
	
	function(declare, ViewController, View, SwapView, PageIndicator, domConstruct, on) {
	
	return declare('saga.PhotoViewController', [ViewController], {
		
		images: null,
		
		indexToShow: null,
		
		pageIndicator: false,
		
		constructor: function(args) {

		},
		
		postCreate: function(){
			this.inherited(arguments);
			if(Window.revealViewController)
				revealViewController.stop();
			this.domNode.style.background = "black";
			var me = this;
        	var swapViewToShow;
        	dojo.forEach(this.images, function(image, i){
        		var view = new View();
	        	view.domNode.style.width = (me.frame.width)+"px";
	        	view.domNode.style.height = (me.frame.height)+"px";
	        	view.domNode.style.textAlign = "center";
	        	//view.domNode.style.overflow = "hidden";
	        	if(image.base64)
	        		var img = domConstruct.create("img", {src:"data:image/jpeg;base64,"+base64, border:"1", style:"vertical-align:middle;max-width:"+(me.frame.width-10)+"px;max-height:"+(me.frame.height-36)+"px;"}, view.domNode);
	        	else if(image.src)
 	        		var img = domConstruct.create("img", {src:image.src, border:"1", style:"vertical-align:middle;max-width:"+(me.frame.width-10)+"px;max-height:"+(me.frame.height-36)+"px;"}, view.domNode);
 	        	else
 	        		var img = domConstruct.create("img", {id:"image"+i, src:image, border:"1", style:"position:absolute;vertical-align:middle;max-width:"+(me.frame.width)+"px;max-height:"+(me.frame.height)+"px;"}, view.domNode);
 	        	img.onload = function(evt){
 	        		var shrinkedSize = me._sizeForShrinkedImage(img, {width:me.frame.width, height:me.frame.height});
 	        		img.frame = {x:(me.frame.width-shrinkedSize.width)/2, y:0, width:shrinkedSize.width, height:shrinkedSize.height};
 	        		img.style.left = img.frame.x+"px";
 	        	}
        		var swapView = new SwapView({selected:true});
	  			swapView.addChild(view);
	        	swapView.placeAt(me.domNode);
	        	swapView.domNode.style.overflow = "hidden";
	        	swapView.startup();
	        	if(i == me.indexToShow)
	        		swapViewToShow = swapView;
        	});
        	swapViewToShow.show();
        	
        	if(this.pageIndicator){
        		var pi = new PageIndicator();
	        	pi.domNode.style.position = "absolute";
	        	pi.domNode.style.top = (this.frame.height-20)+"px";
	        	pi.placeAt(this.domNode);
	        	pi.startup();	
        	}
        	
        	
		},
		
		//warning: zoom and slide not compatible 
		addZommOnImage: function(imageID, containerID){
			var me = this;
			var hammer, height, image, offset, origin, prevScale, scale, screenOrigin, translate, width, wrap;

	        image = $("#"+imageID);
	        /*image.on("mousedown", function(evt){
	        	console.log(evt);
	        	image.mousedownCoord = {x:evt.clientX, y:evt.clientY};
	        });
	        image.on("mouseup", function(evt){
	        	image.mousedownCoord = null;
	        });
	        image.on("mousemove", function(evt){
	        	if(image.mousedownCoord){
	        		var diff = evt.clientX-image.mousedownCoord.x;
		        	console.log(diff);
		        	console.log(image.scale);
		        	image[0].left += diff;
		        	image[0].style.left = image[0].left+"px";
		        	evt.stopPropagation();
		        }
	        });*/
			
			var down = function(evt){
				if(me._pointInImage(image[0], {x:evt.clientX, y:evt.clientY})) {
					image[0]._lastDragPosition = {x:evt.clientX, y:evt.clientY};
				}
			}
			on(image[0].parentNode, "mousedown", down);
	        on(image[0].parentNode, "touchstart", down);
			
			
			var up = function(evt){
				image[0]._lastDragPosition = null;
			}
			on(document.body, "mouseup", up);
			on(document.body, "touchend", up);	
			
			var move = function(evt){
				if(image[0]._lastDragPosition) {
					var xdiff = evt.clientX - image[0]._lastDragPosition.x;
					var ydiff = evt.clientY - image[0]._lastDragPosition.y;
					var newFrame = {x:image[0].frame.x+xdiff, y:image[0].frame.y+ydiff, width:image[0].frame.width, height:image[0].frame.height};
					me._setImageFrame(image[0], newFrame);
					image[0]._lastDragPosition = {x:evt.clientX, y:evt.clientY};
					evt.stopPropagation();
				}
			}
			on(image[0].parentNode, "mousemove", move);
			on(image[0].parentNode, "touchmove", move);
			
			
	        wrap = $("#"+containerID);
	        width = image.width();
	        height = image.height();
	        offset = wrap.offset();
	        origin = {
	            x: 0,
	            y: 0
	        };
	        screenOrigin = {
	            x: 0,
	            y: 0
	        };
	        translate = {
	            x: 0,
	            y: 0
	        };
	        scale = 1;
	        prevScale = 1;
	
	        hammer = image.hammer({
	            prevent_default: true,
	            scale_treshold: 0,
	            drag_min_distance: 0
	        });
	
	       hammer.bind('transformstart', function(event) {
	            screenOrigin.x = (event.originalEvent.touches[0].clientX + event.originalEvent.touches[1].clientX) / 2;
	            return screenOrigin.y = (event.originalEvent.touches[0].clientY + event.originalEvent.touches[1].clientY) / 2;
	        });
	
	        hammer.bind('transform', function(event) {
	            var newHeight, newWidth;
	            scale = prevScale * event.scale;
	
	            newWidth = image.width() * scale;
	            newHeight = image.height() * scale;
	
	            origin.x = screenOrigin.x - offset.left - translate.x;
	            origin.y = screenOrigin.y - offset.top - translate.y;
	
	            translate.x += -origin.x * (newWidth - width) / newWidth;
	            translate.y += -origin.y * (newHeight - height) / newHeight;
	
	            image.css('-webkit-transform', "scale3d(" + scale + ", " + scale + ", 1)");
	            wrap.css('-webkit-transform', "translate3d(" + translate.x + "px, " + translate.y + "px, 0)");
	            width = newWidth;
	            image.scale = scale;
	            console.log(translate.y)
	            return height = newHeight;
	        });
	
	        hammer.bind('transformend', function(event) {
	            return prevScale = scale;
	        });
	           
	 	},
	 	
	 	_pointInImage: function(img, point) {
			return point.x >= img.frame.x && point.x <= img.frame.x+img.frame.width && point.y >= img.frame.y && point.y <= img.frame.y+img.frame.height; 
		},
		
		_setImageFrame: function(img, frame){
			img.style.left = frame.x+"px";
			img.style.top = frame.y+"px";
			img.frame = frame;
		},
		
		_sizeForShrinkedImage: function(image, shrinkSize) {
			var width = image.width;
			var height = image.height;
			if(width <= shrinkSize.width && height <= shrinkSize.height) {
				return {width:width, height:height};
			}
			else {
				if(width > height)
					return {width:shrinkSize.width, height:(shrinkSize.width/width)*height};
				else
					return {width:(shrinkSize.height/height)*width, height:shrinkSize.height};
			}		
		}
	});
});
