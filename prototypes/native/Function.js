var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

Function.prototype.getParamNames = function(){
  var fnStr = this.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
  if(result === null)
     result = [];
  return result;
};

Function.prototype.hasCallback = function(){
	var paramNames = this.getParamNames();
	return paramNames.last() == 'callback';
};

Function.prototype._apply = function(thisArg, argsObject, callback){
	var argsArray = [];
	var hasCallback = false;
	this.getParamNames().forEach(function(paramName){
		if(paramName == "callback"){
			argsArray.push(callback);
			hasCallback = true;
		}
		else{
			argsArray.push(argsObject[paramName]);
		}
	});
	if(hasCallback || !callback){
		return this.apply(thisArg, argsArray);
	}
	else if(callback){
		var ret = this.apply(thisArg, argsArray);
		callback(null, ret);
		return ret;
	}
};