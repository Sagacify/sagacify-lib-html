define([], function () {

	return {

		modelBindv2: false,

		bindModelv2: function () {

			if (!this.modelBindv2) {
				return;
			}

			this._putUids('sgbind');

			if (!this.model) {
				throw new Error('unknow model');
			}

			var me = this;
			$('[data-sgbind-' + this.uid + ']', this.el).each(function (index) {
				attributeInfo = $(this).attr('data-sgbind-' + me.uid);
				me.addBind($(this), attributeInfo);
			});

			this.getModelBinds();
		},

		// Attribute info: "change:name->.html(value)" 
		// Attribute info: ":name->.html(value)" <=> change:name->.html(value)
		// Attribute info: ":name" <=> change:name->.html(value)
		// Attribute info: "change:name" <=> change:name->.html(value)
		// Call nameToEl if present in controller
		addBind: function (node, attributeInfo) {
			var splittedAttribute = attributeInfo.split("->");

			var trigger = null;
			var viewAction = null;
			var method = null;

			if (splittedAttribute.length >= 2) {
				viewAction = splittedAttribute[1];
			} else {
				viewAction = '$.html(value)';
			}
			trigger = splittedAttribute[0];
			if (trigger.startsWith(':')) {
				trigger = 'change' + trigger;
			}

			var me = this;
			this.listenTo(this.model, trigger, function (listener, value, options) {

				if (viewAction.startsWith('$')) {
					var stringToApply = 'node' + viewAction.substring(1);
					console.log(stringToApply);
					try {
						eval(stringToApply);
					} catch (err) {
						throw "Bad formated action " + viewAction;
					}
				} else {
					if (me[viewAction]) {
						return this[viewAction](value, node);
					} else {
						throw "Unknow thing to do with event " + this.getModelBinds()[trigger + "->" + viewAction];
					}
				}
			});

			this.getModelBinds()[trigger + "->" + viewAction] = node;
		},

		getModelBinds: function () {
			if (!this._bindsV2) {
				this._bindsV2 = {};
			}
			return this._bindsV2;
		}
	};
});