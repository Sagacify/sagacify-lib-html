define([
	'saga/model/ModelError'
], function (
	ModelError
) {
	return function (SagaCollection) {

		return {
			
			validate: function (attrs, options) {
				var error;
				for (var i = 0; i < this.models.length; i++) {
					error = this.models[i].validate && this.models[i].validate(attrs, options);
					if (error) {
						return error;
					}
				}

				return;
			},

			generateError: function (verbose, id) {
				return new ModelError({
					verbose: verbose,
					identifier: id,
					model: this
				});
			}
		};
	};
});