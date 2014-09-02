define([
	'backbone'
], function () {

	Backbone.history.lock = function(customCheckUrl){
		this.unlock();
		Backbone.$(window).off('popstate', this.checkUrl);
		var me = this;
		if(customCheckUrl){
			var onPopstate = function(){
				customCheckUrl();
				me.fragment = me.getFragment();
			}
			this._lock = {
				customCheckUrl: onPopstate
			}
			Backbone.$(window).on('popstate', onPopstate);
		}
	};

	Backbone.history.unlock = function(){
		if(this._lock && this._lock.customCheckUrl){
			Backbone.$(window).off('popstate', this._lock.customCheckUrl);
		}
		Backbone.$(window).on('popstate', this.checkUrl);
		delete this._lock;
	};

});