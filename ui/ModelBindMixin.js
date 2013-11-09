define([], function(){
	
	return {

		modelBind: false,

		//TODO: remove events on destroy
		// bindToModel: function(){
		// 	if(this.modelBind && this.model && !this._modelBinder){
		// 		this._modelBinder = new Backbone.ModelBinder();
		// 		var bindings = this.modelBind.isObject()?this.modelBind:Backbone.ModelBinder.createDefaultBindings(this.el, 'bind');
		// 		var me = this;
		// 		for(var attr in bindings){
		// 			var selector = bindings[attr].selector||bindings[attr];
		// 			var els = $(selector, me.el);
		// 			me.handleValidation(els, attr);
		// 			for(var i = 0; i < els.length; i++){
		// 				var el = els[i];
		// 				if(el instanceof HTMLImageElement){
		// 					me.bindImage(el, attr);
		// 				}
		// 			};
		// 		};
		// 		this._modelBinder.bind(this.model, this.el, bindings);
		// 	}
		// },

		bindToModel: function(){
			if(this.modelBind && this.model && !this._modelBound){
				var treeVirtuals = this.model.treeVirtuals();
				for(var attr in treeVirtuals){
					var selector = "[bind='"+attr+"']";
					if(this.modelBind[attr]&&this.modelBind[attr].selector)
						selector += ", "+this.modelBind[attr].selector;
					else if(this.modelBind[attr]){
						selector += ", "+this.modelBind[attr];
					}
					var els = $(selector, this.el);
					this.bindEls(els, attr);
					this.bindValidation(els, attr);
				}

				this._modelBound = true;
			}
		},

		bindEls: function(els, attr){
			this.bindImages(els.filter(':image'), attr);
			this.bindInputDates(els.filter(':input[type=date]'), attr);
			this.bindSelects(els.filter('select'), attr);
			this.bindInputs(els.filter(':input').not(':input[type=date], select'), attr);
			this.bindDefaults(els.not(':image, :input'), attr);
		},

		bindImages: function(imgs, attr){
			if(!imgs.length)
				return;
			this.model.on('change:'+attr, function(model){
				imgs.attr('src', this[attr]);
			});
		},

		bindInputs: function(inputs, attr){
			if(!inputs.length)
				return;
			var me = this;
			inputs.on('change', function(){
				me.model[attr] = this.value;
			});
			this.model.on('change:'+attr, function(){
				inputs.val(this[attr]);
			});
		},

		bindInputDates: function(inputDates, attr){
			if(!inputDates.length)
				return;
			var me = this;
			inputDates.on('change', function(){
				me.model[attr] = new Date(this.value);
			});
			this.model.on('change:'+attr, function(){
				inputDates.val(this[attr].inputFormat());
			});
		},

		bindSelects: function(selects, attr){
			if(!selects.length)
				return;
			var me = this;
			selects.on('change', function(){
				me.model[attr] = this.options[this.selectedIndex].innerHTML;
			});
			this.model.on('change:'+attr, function(){
				$('[value='+this[attr]+']', selects).prop('selected', true);
			});
		},

		bindDefaults: function(els, attr){
			if(!els.length)
				return;
			this.model.on('change:'+attr, function(){
				els.html(this[attr]);
			});
		},

		validClass: function(attr){
			return 'valid';
		},

		errorClass: function(attr){
			return 'error';
		},

		bindValidation: function(els, attr){
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