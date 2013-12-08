define(["../model/Model"], function(Model){
	
	return {

		modelBind: false,

		bindToModel: function(){
			if(this.modelBind && this.model && !this._modelBound){
				//var validClass = typeof this.validClass === 'function' ? this.validClass(attr) : this.validClass;
				//var errorClass = typeof this.errorClass === 'function' ? this.errorClass(attr) : this.errorClass;
				var treeVirtuals = this.model.treeVirtuals();
				var me = this;
				var getSelector = function(attr){
					var selector = "[bind='"+attr+"']";
					if(me.modelBind[attr]&&me.modelBind[attr].selector)
						selector += ", "+me.modelBind[attr].selector;
					else if(me.modelBind[attr]){
						selector += ", "+me.modelBind[attr];
					}
					if(me.modelBind._container){
						var splitContainer = me.modelBind._container.split(',');
						var containedSelector = "";
						splitContainer.forEach(function(container, i){
							containedSelector += container+" "+selector;
							if(i < splitContainer.length-1){
								containedSelector += ",";
							}
						});
						// selector = me.modelBind._container+" "+selector;
						selector = containedSelector;
					}
					return selector;
				}
				for(var attr in treeVirtuals){
					var selector = getSelector(attr);
					var els = $(selector, this.el);
					this.bindEls(els, this.model, attr, attr);
					//this.model.bindToEls(els, attr);
					//this.model.bindValidationToEls(els, attr, validClass, errorClass);
					//single embedded doc binding || developed ref doc
					var child = this.model[attr];
					if(this.model.schema.tree[attr] instanceof Array && this.model.schema.tree[attr][0].single)
						child = child.models[0];
					if(child instanceof Model){
						var embeddedTreeVirtuals = child.treeVirtuals();
						for(var embeddedAttr in embeddedTreeVirtuals){
							var selector = getSelector(attr+"."+embeddedAttr);
							var embeddedEls = $(selector, this.el);
							me.bindEls(embeddedEls, child, embeddedAttr, attr+"."+embeddedAttr);
							//child.bindToEls(embeddedEls, embeddedAttr);
							//child.bindValidationToEls(embeddedEls, embeddedAttr, validClass, errorClass);
						}
					}
				}

				this._modelBound = true;
			}
		},

		bindEls: function(els, model, attr, fullAttr){
			this.bindImages(els.filter('img'), model, attr, fullAttr);
			this.bindInputDates(els.filter(':input[type=date]'), model, attr, fullAttr);
			this.bindInputCheckboxs(els.filter(':input[type=radio]'), model, attr, fullAttr);
			this.bindSelects(els.filter('select'), model, attr, fullAttr);
			this.bindInputs(els.filter(':input').not(':input[type=date], :input[type=radio],select'), model, attr, fullAttr);
			this.bindDefaultsEls(els.not('img, :input'), model, attr, fullAttr);

			this.bindValidation(els, model, attr);
		},

		bindImages: function(imgs, model, attr, fullAttr){
			if(!imgs.length)
				return;
			imgs.on('load', function(){
				model[attr] = $(this).attr('src');
			});

			if(typeof model[attr] == "string"){
				imgs.attr('src', model[attr]);
			}
			this.listenTo(model, 'change:'+attr, function(model){
				imgs.attr('src', model[attr]);
			});
		},

		bindInputs: function(inputs, model, attr, fullAttr){
			if(!inputs.length)
				return;

			var me = this;
			inputs.change(function(){
				if($(this).hasClass('picker__input') && this.value.length > 2 && this.value[2]==':'){
					model[attr] = me.attrToModel(fullAttr, $(this).pickatime('picker').get('highlight', 'HH:i'), $(this));
				}
				else{
					model[attr] = me.attrToModel(fullAttr, this.value, $(this));
				}
			});

			//if(this[attr] != null){
				inputs.val(this.attrToEl(fullAttr, model[attr]||"", inputs));
			//}
			this.listenTo(model, 'change:'+attr, function(){
				if(inputs.hasClass('picker__input')){
					if(model[attr] instanceof Date){
						inputs.val(me.attrToEl(fullAttr, model[attr].toLocaleString().split(" ")[0], inputs));
					}
				}
				else{
					inputs.val(me.attrToEl(fullAttr, model[attr], inputs));
				}
			});
		},

		bindInputDates: function(inputDates, model, attr, fullAttr){
			if(!inputDates.length)
				return;
			var me = this;

			inputDates.on('blur', function(evt){
				model[attr] = new Date(this.value);
			});

			if(model[attr] && model[attr].getTime()){
				inputDates.val(model[attr].inputFormat());
			}
			this.listenTo(model, 'change:'+attr, function(){
				if(model[attr] && model[attr].getTime && model[attr].getTime())
					inputDates.val(model[attr].inputFormat());
			});
		},

		bindInputCheckboxs: function(inputs, model, attr, fullAttr){
			if(inputs.length) {
				var me = this;
				$('input[name="'+inputs.prop('name')+'"]', inputs.parentsUntil().last()).change(function(evt){
					model[attr] = inputs.prop('checked');
				});

				if(model[attr] != null){
					inputs.prop('checked', model[attr]);
				}
				this.listenTo(model, 'change:'+attr, function(evt){
					inputs.prop('checked', model[attr]);
				});
			}
		},

		bindSelects: function(selects, model, attr, fullAttr){
			if(selects.length) {
				var me = this;
				selects.on('change', function(){
					model[attr] = this.options[this.selectedIndex].innerHTML;
				});

				if(model[attr] != null) {
					$('[value="'+model[attr]+'"]', selects).prop('selected', true);
				}
				this.listenTo(model, 'change:'+attr, function(){
					$('[value="'+model[attr]+'"]', selects).prop('selected', true);
				});
			}
		},

		bindDefaultsEls: function(els, model, attr, fullAttr){
			if(!els.length)
				return;
			if(model[attr] != null)
				els.html(this.attrToEl(fullAttr, model[attr]||"", els));

			this.listenTo(model, 'change:'+attr, function(){
				if(model[attr] != null)
					els.html(this.attrToEl(fullAttr, model[attr], els));
			});
		},

		attrToModel: function(attr, val, els){
			var pathToModel = attr.charAt(0)+attr.capitalize().slice(1)+'ToModel';
			if(typeof this[pathToModel] == 'function'){
				return this[pathToModel](val, els);
			}
			return val;
		},

		attrToEl: function(attr, val, els){
			var pathToModel = attr.charAt(0)+attr.capitalize().slice(1)+'ToEl';
			if(typeof this[pathToModel] == 'function'){
				return this[pathToModel](val, els);
			}
			return val;
		},

		validClass: function(attr){
			return 'valid';
		},

		errorClass: function(attr){
			return 'error';
		},

		bindValidation: function(els, model, attr){
			var me = this;
			this.model.on('change:'+attr, function(model){
				var validClass = typeof me.validClass === 'function' ? me.validClass(attr) : me.validClass;
				var errorClass = typeof me.errorClass === 'function' ? me.errorClass(attr) : me.errorClass;
				if(this.sgValidate(attr).success){
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