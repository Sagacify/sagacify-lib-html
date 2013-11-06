var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

var fun_proto = {};

fun_proto.getParamNames = function(){
  var fnStr = this.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
  if(result === null)
     result = [];
  return result;
};

fun_proto.hasCallback = function(){
	var paramNames = this.getParamNames();
	return paramNames.last() == 'callback';
};

fun_proto._apply = function(thisArg, argsObject, callback){
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

for(var key in fun_proto){
	Object.defineProperty(Function.prototype, key, {value: fun_proto[key]});
}