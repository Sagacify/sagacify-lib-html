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

		//ATTENTION! tu ecrase un attribut de marrionnette...
		sgisRendered: function(){
			return this._firstRenderDone;
		},

		reinjectFirstElement: function(){

			var me = this;
			var firstLine = $(this.template.substring(0, this.template.indexOf('>')+1));

			if (!firstLine[0]) {
				debugger
			};
			$.each(firstLine[0].attributes, function(){
				me.$el.attr(this.name, this.value);
			});

			if(typeof this.onFirstElementsReinjected == "function"){
				this.onFirstElementsReinjected();
			}
		}
	}

});