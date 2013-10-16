define([
	'backbone'
], function () {
	return Backbone.Router.extend({

		//Root path for all routes defined by this router. Override this in a deriving
		//class for keeping route table DRY.
		urlRoot: undefined,

		//override the route method to prefix the route URL
		route: function (route, name, callback) {

			if(this.urlRoot) {
				route = (route === '' ? this.urlRoot : this.urlRoot + '/' + route);
			}

			//define route
			Backbone.Router.prototype.route.call(this, route, name, callback);

			//also support URLs with trailing slashes
			Backbone.Router.prototype.route.call(this, route + '/', name, callback);

		}
	});
});