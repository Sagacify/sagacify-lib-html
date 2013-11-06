define([], function(){
	
	return {

		modelBind: false,

		//TODO: remove events on destroy
		bindToModel: function(){
			if(this.modelBind && this.model && !this._modelBinder){
				this._modelBinder = new Backbone.ModelBinder();
				var bindings = this.modelBind.isObject()?this.modelBind:Backbone.ModelBinder.createDefaultBindings(this.el, 'bind');
				var me = this;
				for(var attr in bindings){
					var selector = bindings[attr].selector||bindings[attr];
					var els = $(selector, me.el);
					me.handleValidation(els, attr);
					for(var i = 0; i < els.length; i++){
						var el = els[i];
						if(el instanceof HTMLImageElement){
							me.bindImage(el, attr);
						}
					};
				};
				this._modelBinder.bind(this.model, this.el, bindings);
			}
		},

		bindImage: function(img, attr){
			this.model.on('change:'+attr, function(model){
				img.src = this[attr];
			});
		},

		validClass: function(attr){
			return 'valid';
		},

		errorClass: function(attr){
			return 'error';
		},

		handleValidation: function(els, attr){
			var me = this;
			this.model.on('change:'+attr, function(model){
				var validClass = typeof me.validClass == "function"?me.validClass(attr):me.validClass;
				var errorClass = typeof me.errorClass == "function"?me.errorClass(attr):me.errorClass;
				if(this.validate(attr).success){
					els.removeClass(errorClass);
					els.addClass(validClass);
				}
				else{
					els.removeClass(validClass);
					els.addClass(errorClass);
				}
			});
		}
	}

});