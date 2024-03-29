define(['backbone', 'backbone.marionette'], function(Backbone, Marionette){
	return Marionette.AppRouter.extend({

		aliases: {

		},

		constructor: function(options){
			Marionette.AppRouter.prototype.constructor.apply(this, arguments);
			if(this.sagaRoutes){
				this.handleSagaRoutes();
			}
		},

		handleSagaRoutes: function(){
			for(var route in this.sagaRoutes) {
				var specRoute = this.sagaRoutes[route];
				var alias = "";
				if(route.contains(" \@ ")){
					var splitRoute = route.split(" \@ ");
					alias = splitRoute[0];
					route = splitRoute[1];
					this.aliases[alias] = route;
				}
				this.route(route, alias||route, this.handleSagaRoute(alias, route, specRoute));
			}
		},

		handleSagaRoute: function(alias, route, funs){
			if(!(funs instanceof Array)){
				funs = [funs];
			}

			var me = this;
			return function () {
				var args = Array.apply(null, arguments);
				me.lastRoute = {alias: alias, route:route, args:args.clone()};
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
				};
				var layout = App.layout;
				funs.forEach(function(fun){
					if(typeof layout.willShowChild == "function"){
						layout.willShowChild();
					}
					layout = routeLayout(layout, fun);
				});
			};
		},

		navigate: function(){
			var args = Array.apply(null, arguments);
			//args[0] = App.uris[args[0]]||args[0];
			args[0] = this.aliases[args[0]]!=null?this.aliases[args[0]]:args[0];
			if(!args[1]) {
				args[1] = {};
			}

			//check if args for route (:var)
			for(key in args[1]){
				if(args[0].contains(':'+key)){
					args[0] = args[0].replace(':'+key, args[1][key]);
				}
			}
			if(!('trigger' in args[1])) {
				args[1].trigger = true;
			}

			if(args[1].forceReload && args[0] == Backbone.history.fragment){
				this.forceReload();
			}
			else{
				Marionette.AppRouter.prototype.navigate.apply(this, args);
			}
		},

		forceReload: function(){
			Backbone.history.loadUrl(Backbone.history.fragment);
		},	

		isAuth: function(){
			return true;
		},

		authFailed: function(){

		}
		
	});
});