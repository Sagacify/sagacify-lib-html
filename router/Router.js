define(['backbone', 'backbone.marionette'], function(Backbone, Marionette){
	return Marionette.AppRouter.extend({

		constructor: function(options){
			Marionette.AppRouter.prototype.constructor.apply(this, arguments);
			if(this.sagaRoutes){
				this.handleSagaRoutes();
			}
		},

		handleSagaRoutes: function(){
			for(var route in this.sagaRoutes){
				this.route(route, "sagaRoute", this.handleSagaRoute(route, this.sagaRoutes[route]));
			}
		},

		handleSagaRoute: function(route, funs){
			if(!(funs instanceof Array)){
				funs = [funs];
			}

			return function(args){
				args = args||[];
				var routeLayout = function(layout, fun){
					if(layout && typeof layout[fun] == "function"){
						var numberParams = layout[fun].getParamNames().length;
						return layout[fun].apply(layout, args.splice(0, numberParams));
					}
					else{
						throw new Error("Route " + route + " not followable.");
					}
				}

				var layout = App.view;
				funs.forEach(function(fun){
					layout = routeLayout(layout, fun);
				});
			}
		}

	});
});