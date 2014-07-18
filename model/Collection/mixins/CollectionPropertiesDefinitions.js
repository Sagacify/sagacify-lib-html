define([
	'../../../ajax/SGAjax',
], function (
SGAjax
	) {
	return function(SagaCollection){
		return {

			defineSchemaProperties: function () {
				if (!this.schema) return;

				var properties = {};

				var get = function (attr) {
						return function () {
							return this.get(attr);
						};
					};

				var getAction = function (action) {
						return function () {
							return function () {
								var argsArray = Array.apply(null, arguments);
								//return this.do.apply(this, [action, argsArray]);
								return this.do.apply(this, [action, argsArray[0], argsArray[1]]);
							};
						};
					};

				this.schema.virtuals.keys().forEach(function (key) {
					properties[key] = {
						get: get(key)
					};
				});

				this.schema.actions.keys().forEach(function (key) {
					properties[key] = {
						get: getAction(key)
					};
				});

				Object.defineProperties(this, properties);
			},

			addGetterProperty: function (id) {
				if (!id) return;

				var get = function (attr) {
						return function () {
							return this.get(attr);
						};
					};
				var properties = {};
				properties["id_" + id] = {
					get: get(id)
				};
				Object.defineProperties(this, properties);
			},

			do: function (action, args) {
				var url = this.url instanceof Function ? this.url() : this.url;
				if (args instanceof Array) {
					argsObj =   {};
					if (this.schema.actions[action]) {
						this.schema.actions[action].args.forEach(function (arg, i) {
							argsObj[arg] = args[i];
						});
					}
					args = argsObj;
				}
				return SGAjax.ajax({
					type: 'POST',
					url: url + '/' + action,
					data: args || {}
				});
			},


		}
	}
});




		