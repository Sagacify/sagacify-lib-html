define([
	'saga/model/ModelError'
], function (
	ModelError
) {
	return function (SagaCollection) {

		return {
			
			validate: function () {
				var error;
				for (var i = 0; i < this.models.length; i++) {
					error = this.models[i].validate && this.models[i].validate();
					if (error) {
						return error;
					}
				}

				return undefined;
			},

			generateError: function (verbose, id) {
				return new ModelError({
					verbose: verbose,
					identifier: id,
					model: this
				});
			},

			isValid: function () {
				var error = this.validate();
				if (error) {
					return false;
				} else {
					return true;
				}
			}
		};
	};
});