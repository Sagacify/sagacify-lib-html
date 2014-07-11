define([
], function () {

	var ModelError = function(options){
		options = _.defaults(options||{}, {
			verbose: "Unknow",
			identifier:0,
			model: null
		});

		this.verbose = options.verbose;
		this.identifier = options.identifier;
		this.model = options.model;
	};

	return ModelError;

});