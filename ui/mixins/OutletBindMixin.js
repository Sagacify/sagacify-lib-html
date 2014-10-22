define([], function () {

	return {

			outletsBind: false,

		_putUids: function (dataType) {
			var me = this;

			$('[data-' + dataType + ']', this.el).each(function (index) {
				var $node = $(this);
				$node.attr("data-" + dataType + "-" + me.uid, $node.data()[dataType]);
				$node.removeAttr('data-' + dataType);
			});
		},

		bindOutlets: function () {
			if (!this.outletsBind) {
				return;
			}

			var me = this;

			this._putUids("sgoutlet");

			$('[data-sgoutlet-' + this.uid + ']', this.el).each(function (index) {
				outletName = $(this).attr('data-sgoutlet-' + me.uid);
				me.bindOutlet(this, outletName);
			});
		},

		bindOutlet: function (node, outletName) {
			if (this.getOutlets()[outletName]) {
				//merge outlet binder
				this.getOutlets()[outletName] = $(this.getOutlets()[outletName].get().concat([node]));
				return;
			}

			this.getOutlets()[outletName] = $(node);
		},

		getOutlets: function () {
			if (!this.outlets) {
				this.outlets = {};
			}

			return this.outlets;
		}
		
	};
});
