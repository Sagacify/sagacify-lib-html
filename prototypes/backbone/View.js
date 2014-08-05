define([
	'backbone'
], function (){
	var _listenTo = Backbone.View.prototype.listenTo;

	Backbone.View.prototype.listenTo = function(obj, name, callback){
		if(obj instanceof jQuery){
			var namespace = this.cid;
			obj.on(name+'.'+namespace, callback);
			if(!this._jQueryListeners){
				this._jQueryListeners = [];
			}
			this._jQueryListeners.push(obj);
		}
		else{
			return _listenTo.apply(this, arguments);
		}
	};

	var _stopListening = Backbone.View.prototype.stopListening;

	Backbone.View.prototype.stopListening = function(obj, name, callback){
		if(obj instanceof jQuery){
			var namespace = this.cid;
			obj.off(name+'.'+namespace, callback);
		}
		else{
			if(this._jQueryListeners){
				var namespace = this.cid;
				this._jQueryListeners.forEach(function(obj){
					obj.off('.'+namespace);
				});
			}
			return _stopListening.apply(this, arguments);
		}
	};


	Backbone.View.prototype.appendChild = function(childView, container){
		if (!childView.$el) {
			return;
		};

		container.append(childView.$el);
		if (!childView.onShow) {
			return;
		};
		this.on('show', function(evt){
			childView.onShow();
		});
	};
});