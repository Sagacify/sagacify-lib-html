define([], function () {

	return {
		progressNode: null,
		requestsNode: null,
		currentRequestsCount: 0,
		showRequestsProgress: function (node) {
			node.append('<div>Remaining requests ' + this.currentRequestsCount + '</div>');
		},
		showUploadProgress: function (node, update) {
			var done = update.value;
			var max = update.max;
			node.append('<div>Upload progress ' + (done / (max / 100)) + '% !</div>');
		},
		completionHandler: function (xhr, textStatus) {
			this.currentRequestsCount -= 1;
			if(this.requestsNode) {
				this.showRequestsProgress(this.requestsNode);
			}
			// if('success') {}
			// else if('notmodified') {}
			// else if('error') {}
			// else if('timeout') {}
			// else if('abort') {}
			// else if('parsererror') {}
		},
		beforeSendHandler: function (xhr, settings) {
			this.currentRequestsCount += 1;
		},
		uploadProgressHandler: function (event) {
			if(event.lengthComputable && this.progressNode) {
				this.showUploadProgress(this.progressNode, {
					value: event.loaded,
					max: event.total
				});
			}
		},
		// downloadProgressHandler: function () {
		// 	debugger;
		// },
		methodWrapper: function (type, url, data, cbError, cbSuccess) {
			var me = this;
			return $.ajax({
				// uploadProgress: function () {
				// 	me.downloadProgressHandler.apply(me, arguments);
				// },
				progress: function () {
					me.uploadProgressHandler.apply(me, arguments);
				},
				beforeSend: function () {
					me.beforeSendHandler.apply(me, arguments);
				},
				complete: function () {
					me.completionHandler.apply(me, arguments);
				},
				success: cbSuccess,
				error: cbError,
				data: data,
				type: type,
				url: url
			});
		},
		authorization: function () {
			return {
				Authorization: SGStore.getBearer()
			};
		},
		ajax: function (options) {
			var url = options.url;
			var data = options.data;
			var method = options.type.toLowerCase();
			var headers = options.auth ? this.authorization() : {};
			if(options.dataType != null) {
				headers.dataType = options.dataType;
			}
			var cbError = options.error;
			var cbSuccess = options.success;
			return this[method](url, headers, data, cbError, cbSuccess) || cbError();
		},
		constructor: function (options) {
			$.extend(this, options);
			var originalXhr = $.ajaxSettings.xhr;
			$.ajaxSetup({
				xhr: function () {
					var req = originalXhr();
					var me = this;
					if(req) {
						if(req.addEventListener.isFunction() && (me.progress !== undefined)) {
							req.addEventListener('progress', function (evt) {
								me.progress(evt);
							}, false);
						}
						if(req.upload.isObject() && (me.progressUpload !== undefined)) {
							req.upload.addEventListener('progress', function (evt) {
								me.progressUpload(evt);
							}, false);
						}
					}
					return req;
				}
			});
			var me = this;
			Backbone.ajax = function () {
				me.ajax.apply(me, arguments);
			};
		},
		delete: function (url, headers, data, cbError, cbSuccess) {
			return this.methodWrapper('DELETE', url, data, cbError, cbSuccess);
		},
		post: function (url, headers, data, cbError, cbSuccess) {
			return this.methodWrapper('POST', url, data, cbError, cbSuccess);
		},
		put: function (url, headers, data, cbError, cbSuccess) {
			return this.methodWrapper('PUT', url, data, cbError, cbSuccess);
		},
		get: function (url, headers, data, cbError, cbSuccess) {
			return this.methodWrapper('GET', url, data, cbError, cbSuccess);
		}
	};

});