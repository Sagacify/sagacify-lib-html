define(["../model/Model"], function(Model){
	
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
				var validClass = typeof this.validClass === 'function' ? this.validClass(attr) : this.validClass;
				var errorClass = typeof this.errorClass === 'function' ? this.errorClass(attr) : this.errorClass;
				var treeVirtuals = this.model.treeVirtuals();
				var me = this;
				var getSelector = function(attr){
					var selector = "[bind='"+attr+"']";
					if(me.modelBind[attr]&&me.modelBind[attr].selector)
						selector += ", "+me.modelBind[attr].selector;
					else if(me.modelBind[attr]){
						selector += ", "+me.modelBind[attr];
					}
					if(me.modelBind._container)
						selector = me.modelBind._container+" "+selector;
					return selector;
				}
				for(var attr in treeVirtuals){
					var selector = getSelector(attr);
					var els = $(selector, this.el);
					this.model.bindToEls(els, attr);
					this.model.bindValidationToEls(els, attr, validClass, errorClass);
					//single embedded doc binding || developed ref doc
					var child = this.model[attr];
					if(this.model.schema.tree[attr] instanceof Array && this.model.schema.tree[attr][0].single)
						child = child.models[0];
					
					if(child instanceof Model){
						var embeddedTreeVirtuals = child.treeVirtuals();
						for(var embeddedAttr in embeddedTreeVirtuals){
							var selector = getSelector(attr+"."+embeddedAttr);
							var embeddedEls = $(selector, this.el);
							child.bindToEls(embeddedEls, embeddedAttr);
							child.bindValidationToEls(embeddedEls, embeddedAttr, validClass, errorClass);
						}
					}
				}

				this._modelBound = true;
			}
		},

		// bindEls: function(els, attr){
		// 	this.bindImages(els.filter(':image'), attr);
		// 	this.bindInputDates(els.filter(':input[type=date]'), attr);
		// 	this.bindSelects(els.filter('select'), attr);
		// 	this.bindInputs(els.filter(':input').not(':input[type=date], select'), attr);
		// 	this.bindDefaults(els.not(':image, :input'), attr);
		// },

		// bindImages: function(imgs, attr){
		// 	if(!imgs.length)
		// 		return;
		// 	this.model.on('change:'+attr, function(model){
		// 		imgs.attr('src', this[attr]);
		// 	});
		// },

		// bindInputs: function(inputs, attr){
		// 	if(!inputs.length)
		// 		return;
		// 	var me = this;
		// 	inputs.on('change', function(){
		// 		me.model[attr] = this.value;
		// 	});
		// 	this.model.on('change:'+attr, function(){
		// 		inputs.val(this[attr]);
		// 	});
		// },

		// bindInputDates: function(inputDates, attr){
		// 	if(!inputDates.length)
		// 		return;
		// 	var me = this;
		// 	inputDates.on('blur', function(evt){
		// 		me.model[attr] = new Date(this.value);
		// 	});
		// 	this.model.on('change:'+attr, function(){
		// 		if(this[attr].getTime())
		// 			inputDates.val(this[attr].inputFormat());
		// 	});
		// },

		// bindSelects: function(selects, attr){
		// 	if(!selects.length)
		// 		return;
		// 	var me = this;
		// 	selects.on('change', function(){
		// 		me.model[attr] = this.options[this.selectedIndex].innerHTML;
		// 	});
		// 	this.model.on('change:'+attr, function(){
		// 		$('[value='+this[attr]+']', selects).prop('selected', true);
		// 	});
		// },

		// bindDefaults: function(els, attr){
		// 	if(!els.length)
		// 		return;
		// 	this.model.on('change:'+attr, function(){
		// 		els.html(this[attr]);
		// 	});
		// },

		validClass: function(attr){
			return 'valid';
		},

		errorClass: function(attr){
			return 'error';
		}

		// bindValidation: function(els, attr){
		// 	var me = this;
		// 	this.model.on('change:'+attr, function(model){
		// 		var validClass = typeof me.validClass === 'function' ? me.validClass(attr) : me.validClass;
		// 		var errorClass = typeof me.errorClass === 'function' ? me.errorClass(attr) : me.errorClass;
		// 		if(this.sgValidate(attr).success){
		// 			els.removeClass(errorClass);
		// 			els.addClass(validClass);
		// 		}
		// 		else{
		// 			els.removeClass(validClass);
		// 			els.addClass(errorClass);
		// 		}
		// 	});
		// }
	}

});