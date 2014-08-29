var array_proto = {};

array_proto.contains = function (item) {
	return !!~this.indexOf(item);
};

array_proto.merge = function (array) {
	var me = this;
	array.forEach(function (item) {
		me.push(item);
	});
};

array_proto.findFirst = function (condition) {
	var res = this.filter(condition);
	if (res && res.length) {
		return res[0]
	};
	return null; 
};

array_proto.insert = function (index, item) {
	this.splice(index, 0, item);
};

array_proto.popFirst = function () {
	return this.splice(0, 1)[0];
};

array_proto.pushFirst = function (item) {
	return this.splice(0, 0, item);
};

array_proto.first = function () {
	return this[0];
};

array_proto.last = function () {
	return this[this.length - 1];
};

array_proto.containsObject = function (_id) {
	return this.filter(function (item) {
		return item._id == _id;
	}).length > 0;
};

// array_proto.remove = function(item){
// 	var index = this.indexOf(item);
// 	if(index != -1)
// 		this.splice(index, 1);
// };

array_proto.equals = function (array) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] != array[i])
			return false;
	}
	return true;
};

array_proto.diff = function (a) {
	return this.filter(function (i) {
		return !(a.indexOf(i) > -1);
	});
};

array_proto.populateDevelop = function (callback) {
	if (this.length == 0 || !(this[0] instanceof mongoose.Document)) {
		callback(null, this);
	} else {
		var model = this[0].getModel();
		model.populateDevelop.apply(this, [callback]);
	}
};

for (var key in array_proto) {
	Object.defineProperty(Array.prototype, key, {
		value: array_proto[key]
	});
}