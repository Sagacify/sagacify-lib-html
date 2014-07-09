define([], function(){
	
	return {

		modelBindv2: false,

		__bindingHTMLSeparator : ",",

		bindModelv2: function(){

			return;
			if (!this.modelBindv2) {
				return;
			};
			

			this._putUids();

			if(!this.model){
				throw 'unknow model'
			}

			var me = this;
			$('[data-sgbind'+this.uid+']', this.el).each(function(index){
				attribute = this.dataset['sgbind'+me.uid];
				attrs = null;
				if (attribute.contains(me.__bindingHTMLSeparator)) {
					attrs = attribute.split(me.__bindingHTMLSeparator);
				} else {
					attrs = [attribute];
				}
				for (var i = 0; i < attrs.length; i++) {
					me.addBind($(this), attrs[i]);
				};
				
			});
			
			this.getBinds();
		},

		_putUids: function(){
			var me = this;

			$('[data-sgbind]', this.el).each(function(index){
				var $node = $(this);
				this.dataset["sgbind"+me.uid] = $node.data().sgoutlet
				delete this.dataset["sgbind"];
			});			
		},

		addBind: function(node, attribute){
			// if (!_.has(this.model.attributes, attribute)) {
			// 	throw "unknow attribute"
			// 	return;
			// }; 

			this.getBinds()[attribute] = node;

			var appropriateMethod = "_defaultAttrToEl"
			customMethod = attribute+'ToEl';
			if (this[customMethod]) {
				appropriateMethod = customMethod;
			};

			var me = this;
			this.listenTo(this.model, 'change:'+attribute, function(){
				debugger
				me[appropriateMethod](this.model[attribute], node);
			});

			var val = this.model.get(attribute ,{lazyCreation:false})
			if (val != undefined) {
				this[appropriateMethod](val, node);
			};

		},

		_defaultAttrToEl: function(value, node){
			node.html(value);
		},

		getBinds: function(){
			if (!this._bindsV2) {
				this._bindsV2 = {};
			};
			return this._bindsV2;
		}
	}
});