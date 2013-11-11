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

			return function(){
				var args = Array.apply(null, arguments);;
				var routeLayout = function(layout, fun){
					var fun_name;
					var fun_staticArgs;
					if(typeof fun == "string"){
						fun_name = fun;
						fun_staticArgs = [];
					}
					else{
						var keys = fun.keys();
						fun_name = keys[0];
						fun_staticArgs = fun[fun_name];
						if(!(fun_staticArgs instanceof Array))
							fun_staticArgs = [fun_staticArgs];
					}

					if(layout && typeof layout[fun_name] == "function"){
						var fun_args_names = layout[fun_name].getParamNames();
						var fun_routeArgs = args.splice(0, fun_args_names.length-fun_staticArgs.length);
						return layout[fun_name].apply(layout, fun_staticArgs.concat(fun_routeArgs));
					}
					else{
						throw new Error("Route " + route + " not followable.");
					}
				}

				var layout = App.layout;
				funs.forEach(function(fun){
					layout = routeLayout(layout, fun);
				});
			}
		}
	});
});