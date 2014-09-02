history.lock = function(func){
	this._lock = {
		func: func
	}
};

history.unlock = function(){
	delete this._lock;
};

var back = history.back;
history.back = function(){
	return
	if(this._lock){
		this._lock.func && this._lock.func();
	}
	else{
		back.apply(this, arguments);
	}
};