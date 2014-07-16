String.prototype.startsWith = function(str){
	return this.slice(0, str.length) === str;
};

String.prototype.endsWith = function(str){
	return this.slice(this.length - str.length, this.length) === str;
};

String.prototype.contains = function(str){
	return ~this.indexOf(str);
};

String.prototype.base64Sanitize = function(base64) {
	return base64.replace(/\//g, '-').replace(/\+/g, '_');
};

String.prototype.capitalize = function() {
	var capitalized = "";
	var split = this.split('.');
	split.forEach(function(part){
		capitalized += part.charAt(0).toUpperCase()+part.slice(1);
	});
    return capitalized;
};

String.prototype.inject = function(occurences){
	var strToReturn = this;
	occurences.forEach(function(occurence){
		strToReturn = strToReturn.replace("%s", occurence);
	});
	return strToReturn;
};

String.prototype.idToDate = function (occurences) {
	return new Date(parseInt(this._id.slice(0, 8), 16) * 1000);
};

String.prototype.unsign = function () {
	if (!this) {
		return "";
	};
	var splittedID = this.split("?");
	if (splittedID.length) {
		return splittedID[0];
	};
	return "";

};


String.guid = function(){
	return ""+Math.uuid(10, 10);
	// function s4() {
	//     return Math.floor((1 + Math.random()) * 0x10000)
	//                .toString(16)
	//                .substring(1);
	// }
	// return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

String.prototype.asGetter = function(){
	return 'get'+this.capitalize();
}

String.prototype.asSetter = function(){
	return 'set'+this.capitalize();
	// function s4() {
	//     return Math.floor((1 + Math.random()) * 0x10000)
	//                .toString(16)
	//                .substring(1);
	// }
	// return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}
