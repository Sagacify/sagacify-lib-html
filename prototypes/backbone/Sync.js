var Sync = Backbone.sync;

var memoizeCach = {};

function getHashUrl(method, model, options) {
	options = _.defaults(options || {}, {
		data: {}
	});

	var hash = "";

	hash += method;
	hash += _.result(model, 'url');

	var data = options.data;

	var keys = _.keys(data).sort();

	for (var i = keys.length - 1; i >= 0; i--) {
		hash += keys[i] + data[keys[i]];
	}

	return hash;
}

function getMemoize(method, model, options) {
	var hash = getHashUrl(method, model, options);
	return memoizeCach[hash];
}

function setMemoize(method, model, options, data) {
	var hash = getHashUrl(method, model, options);
	memoizeCach[hash] = data;
	return memoizeCach[hash];
}

Backbone.sync = function (method, model, options) {
	options = _.defaults(options || {}, {
		memoize: false,
	});

	if (options.memoize) {
		var data = getMemoize(method, model, options);

		if (data) {
			var def = new $.Deferred();
			options.success(data, "success", def);
			def.resolve(data);
			return def.promise();
		}
	}

	var success = options.success;
	options.success = function (data, status, def) {
		if (options.memoize) {
			setMemoize(method, model, options, data);
		}
		success && success.apply(this, arguments);
	};

	return Sync.apply(this, arguments);
};