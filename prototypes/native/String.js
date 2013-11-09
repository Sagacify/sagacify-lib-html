String.prototype.startsWith = function(str){
	return this.slice(0, str.length) === str;
};

String.prototype.endsWith = function(str){
	return this.slice(this.length - str.length, this.length) === str;
};

String.prototype.contains = function(str){
	return this.indexOf(str) != -1;
};

String.prototype.base64Sanitize = function(base64) {
	return base64.replace(/\//g, '-').replace(/\+/g, '_');
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.inject = function(occurences){
	var strToReturn = this;
	occurences.forEach(function(occurence){
		strToReturn = strToReturn.replace("%s", occurence);
	});
	return strToReturn;
};