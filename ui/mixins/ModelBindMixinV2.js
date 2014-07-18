define([], function () {

	var Binder = function (model, view, controller) {
		this.node = view;
		this.model = model;
		this.controller = controller;

		this.parseNodeAttribute();
		this.configureBindFunction();

		this.bind();
		
		this.tryTriggerFirstValue();
	}


	_.extend(Binder.prototype, {

		// Attribute info: "change:name->.html(value)" 
		// Attribute info: ":name->.html(value)" <=> change:name->.html(value)
		// Attribute info: ":name" <=> change:name->.html(value)
		// Attribute info: "change:name" <=> change:name->.html(value)
		// Call nameToEl if present in controller
		retrieveNodeData: function(){
			return $(this.node).attr('data-sgbind-'+this.controller.uid);
		},
		setNodeData: function(data){
			$(this.node).attr('data-sgbind-'+this.controller.uid, data);
		},

		//Prepare the binder
		parseNodeAttribute: function(){

			var attributeInfo = this.retrieveNodeData();
			var splittedAttribute = attributeInfo.split("->")			

			this.trigger = null;
			this.viewAction = null;
			this.attribute = null;

			this.trigger = splittedAttribute[0];

			if (!this.trigger) {
				throw "Error with node "+ this.node;
			};

			//Syntaxic sugar :name  <=> change:name
			if (this.trigger.startsWith(':')) {
				this.attribute = this.trigger.replace(':','');
				this.trigger = 'change'+this.trigger;
			};

			if (splittedAttribute.length >= 2) {
				//Action is define 
				//if start with $ -> jquery eval function 
				//Else call delegate 
				this.viewAction = splittedAttribute[1];
			} else {
				//Default action
				if (this.attribute && (this.attribute + 'ToEl' in this.controller)) {
					//Default action if existe (call delegate)
					this.viewAction = this.attribute + 'ToEl';
				} else {
					//Simple jquery html function
					this.viewAction = '$.html(value)';
				}
			};
		},

		isJqueryEvalAction: function () {
			return this.viewAction.startsWith('$');
		},

		configureBindFunction: function(){
			this._bindFunction = function(model, value, options){

				if (this.isJqueryEvalAction()) {
					//Jquery eval function
					var stringToApply = 'this.node' + this.viewAction.substring(1);
					console.log(stringToApply);
					try {
						eval(stringToApply);
					} catch (err) {
						console.log(err);
						debugger
						throw "Bad formated action " + this.viewAction;
					}
				} else {
					//Delegate to controller
					if (this.viewAction in this.controller) {
						e = {
							model: this.model,
							value: Array.apply(null, arguments),
							options: options,
						};

						if (this.attribute) {
							//Back change: action
							e.value = value;
						}

						this.controller[this.viewAction](e, this.node, this);
					} else {
						throw "Unknow thing to do with event " + this.getIdentifier() + " - " + this.node;
					}
				}
			};
		},

		unBind: function () {
			if (this.trigger =='change:record-change') {
				debugger
			};

			this.model.off(this.trigger, this._bindFunction, this);
			this.controller = null;
			this.node = null;
			this.model = null;
		},

		bind: function () {
			this.model.on(this.trigger, this._bindFunction, this);
		},

		mergeWith: function (anotherBind) {
			this.node = $(this.node.get().concat(anotherBind.node.get()));
		},

		getIdentifier: function () {
			return this.trigger + "-" + this.viewAction + "-" + this.model.id;
		},

		tryTriggerFirstValue: function () {
			if (this.attribute) {
				var value = this.model.get(this.attribute, {
					lazyCreation: false
				});
				this._bindFunction.apply(this, [this.model, value]);
			} else {
				//unknow how to retrieve value.
			}
		},

	});

	return {

		modelBindv2: false,

		__createAllBinders: function () {

			if (!this.modelBindv2) {
				return;
			}

			this._putUids('sgbind');

			if (!this.model) {
				throw new Error('unknow model');
			}

			//Auto generate binds
			this.__getModelBinds();

			var me = this;
			$('[data-sgbind-' + this.uid + ']', this.el).each(function (index) {
				me.__addBind(new Binder(me.model, $(this), me));
			});
		},

		__destroyAllBinder: function () {
			if (!this.modelBindv2) {
				return;
			}

			_.each(this.__getModelBinds(), function (bind, identifier) {
				bind.unBind();
			}, this);
			this.__getModelBinds();
		},

		__addBind: function (bindObj) {
			var existSameBind = this.__getModelBind(bindObj.getIdentifier());

			if (this.__getModelBind(bindObj.getIdentifier())) {
				existSameBind.mergeWith(bindObj);
			} else {
				this.__getModelBinds()[bindObj.getIdentifier()] = bindObj;
			}
		},

		__removeBinds: function () {
			_.each(this.__binds, function (bind) {
				bind.destroy();
				delete this.__binds[name];
			}, this);
			this.__binds = {};
		},

		__getModelBind: function (id) {
			this.__getModelBinds()[id];
		},

		__getModelBinds: function () {
			if (!this.__binds) {
				this.__binds = {};
			}
			return this.__binds;
		}
	};
});