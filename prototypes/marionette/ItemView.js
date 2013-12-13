define([
	'saga/types/validateType',
	'backbone.marionette'
], function (is) {

	var ItemViewCopy = {
		constructor: Backbone.Marionette.ItemView.prototype.constructor,
		render: Backbone.Marionette.ItemView.prototype.render
	};

	_.extend(Backbone.Marionette.ItemView.prototype, {

		constructor: function(options){
			this._handleGoTo();
			this.options = options||{};
			for(var key in options){
				if(key in this){
					this[key] = options[key];
				}
			}
			return ItemViewCopy.constructor.apply(this, arguments);
		},

		render: function(){
			ItemViewCopy.render.apply(this, arguments);
			for(var key in this.goTo){
				var sel = key.split(" ")[1];
				$(sel, this.$el).filter("a").attr("href", App.router.aliases[this.goTo[key]]||this.goTo[key]);
			}
			$(this.el).i18n();
		},

		_handleGoTo: function(){
			this.events = this.events||{};
			var me = this;
			if(this.goTo){
				this.goTo.keys().forEach(function(key){
					me.events[key] = function(evt){
						if(app.layout.modalRegion)
							app.layout.modalRegion.hide();
						app.router.navigate(me.goTo[key]);
					};
				});
			}
		},

		sgValidate: function (domNode) {
			domNode = domNode || this.$el || $(this.el);
			var isValid = true;
			if(this.model instanceof Backbone.Model) {
				isValid = isValid && this.sgValidateMe(domNode, this.model);
			}
			var regionDefs = this.regions;
			if(regionDefs && is.Object(regionDefs)) {
				var children = Object.keys(regionDefs);
				if(children && is.Array(children) && children.length) {
					isValid = isValid && this.sgValidateChildren(this, children, domNode, this.regions);
				}
			}
			return isValid;
		},

		sgValidateMe: function (domNode, model) {
			var isValid = true;
			if(model instanceof Backbone.Model) {
				var binds = $('[bind]', domNode);
				var lenBinds = binds.length;
				var node;
				var attr;
				while(lenBinds--) {
					node = $(binds[lenBinds]);
					if(domNode.find(node).length) {
						attr = node.attr('bind');
						if((attr != null) && !model.sgValidate(attr).success) {
							isValid = false;
							console.log(attr + ' failed !');
							break;
						}
						else {
							console.log(attr + ' passed');
						}
					}
				}
			}
			return isValid;
		},

		sgValidateCollection: function (domNode, sgValidate) {
			var isValid = true;
			if(this.currentView && (this.currentView.collection instanceof Backbone.Collection)) {
				var children = this.currentView.children;
				var lenChildren = children.length;
				var child;
				while(lenChildren--) {
					child = this.currentView.children.findByIndex(lenChildren);
					if(!sgValidate.call(child, domNode)) {
						isValid = false;
						break;
					}
				}
			}
			return isValid;
		},

		isCollectionView: function (child) {
			return child.currentView && (child.currentView.collection instanceof Backbone.Collection);
		},

		sgValidateChildren: function (self, children, domNode, regionDefs) {
			var lenChildren = children.length;
			var isValid = true;
			var child;
			var node;
			while(lenChildren--) {
				child = self[children[lenChildren]];
				node = child.el;
				if(domNode.find(node).length) {
					if(this.isCollectionView(child) && !this.sgValidateCollection.call(child, domNode, this.sgValidate)) {
						isValid = false;
						break;
					}
					else if(this.sgValidateCollection.call(child, domNode, this.sgValidate) && !this.sgValidate.call(child, domNode)) {
						isValid = false;
						break;
					}
				}
			}
			return isValid;
		}

	});
});