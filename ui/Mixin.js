define([], function(){
	
	return {

		_firstRenderDone: false,

		onFirstRender: null,

		get_Template: function (data, settings) {
			return this._template ? _.template(this._template, data, settings) : this.template;
		},

		_handleFirstRender: function(){
			var me = this;
			this.on('render', function(){
				if(!me._firstRenderDone){
					if(typeof me.onFirstRender == "function"){
						me.onFirstRender();
					}
					me.trigger('render:first');
					me._firstRenderDone = true;
				}
			});
		},

		isRendered: function(){
			return this._firstRenderDone;
		},

		parseFirstElement: function(){
			if(!this.template)
				return;

			var inTag = this.template.split('<')[1].split('>')[0];
			var elems = inTag.split(' ');
			this.tagName = elems[0];
			return elems;
		},

		reinjectFirstElement: function(elems){
			if(!elems)
				return;

			var me = this;
			elems.forEach(function(elem){
				var splitElement = elem.split('=');
				var key = splitElement[0];
				var value = splitElement[1];
				if(value){
					value = value.substring(1, value.length-1);
				}

				switch(key){
					case 'class':
					me.$el.addClass(value);
					break;
					case 'style':
					value.split(';').forEach(function(keyval){
						var splitKeyval = keyval.split(':');
						me.$el.css(splitKeyval[0], splitKeyval[1]);
					});
					default:
					me.$el.attr(key, value);
					break;
				}
			});
		}
	}

});