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
		}
	}

});