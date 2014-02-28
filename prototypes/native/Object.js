var obj_proto = {};

obj_proto.clone = function () {
	if ((this == null) || ((typeof this) !== 'object')) {
		return this;
	}
	else {
		var copy = this.constructor();
		for(var attr in this) {
			if(this.hasOwnProperty(attr)) {
				copy[attr] = this[attr];
			}
		}
		return copy;
	}
};

obj_proto.merge = function(obj){
	if(obj && obj.isObject()){
		var me = this;
		obj.keys().forEach(function(key){
			me[key] = obj[key];
		});
	}
	return this;
};

obj_proto.keys = function keys(){
	return Object.keys(this);
};

obj_proto.mget = obj_proto._get = function(field){
	var splitField = field.split('.');
	var toReturn = this;
	splitField.forEach(function(fieldPart){
		if(toReturn)
			toReturn = toReturn[fieldPart];
	});
	return toReturn;
};

obj_proto.mset = obj_proto._set = function(field, value){
	var splitField = field.split('.');
	var objToSet = this;
	for(var i = 0; i < splitField.length-1; i++){
		if(!objToSet[splitField[i]])
			objToSet[splitField[i]] = {};
		objToSet = objToSet[splitField[i]];
	}
	objToSet[splitField.last()] = value;
	return this;
};

obj_proto.deleteRecursiveField = function(field){
	var splitField = field.split('.');
	var delContainer = this;
	for(var i = 0; i < splitField.length-1; i++){
		delContainer = delContainer[splitField[i]];
		if(!delContainer)
			return this;
	}
	delete delContainer[splitField[splitField.length-1]];
	return this;
};

obj_proto.isObject = function(){
	return Object.prototype.toString.call(this) === '[object Object]';
};

obj_proto.isArray = function(){
	return Object.prototype.toString.call(this) === '[object Array]';
};

obj_proto.isString = function(){
	return Object.prototype.toString.call(this) === '[object String]';
};

obj_proto.isFunction = function(){
	return Object.prototype.toString.call(this) === '[object Function]';
};

obj_proto.isVirtualType = function(){
	return this.constructor.name === "VirtualType";
};

obj_proto.pathsKeys = function() {
	var me = this;
	return this.isObject() ? this.keys().reduce(function (base, ele) {
		var children = me[ele].paths();
		return base.concat(children.map(function (child) {
			return ele + (child ? '.' + child : '');
		}));
	}, []) : [''];
};

obj_proto.setHidden = function(path, val){
	Object.defineProperty(this, path, {
		writable: true,
		value: val
	});
};

obj_proto.isEmpty = function(){
	return this.keys().length == 0;
};


Object.values = function (obj) {
    var vals = [];
    
    for (var i = 0; i < Object.keys(obj).length; i++) {
    	var key = Object.keys(obj)[i];

    	vals.push(obj[key]);
    };
    return vals;
}



for(var key in obj_proto){
	Object.defineProperty(Object.prototype, key, {writable: true, value: obj_proto[key]});
}