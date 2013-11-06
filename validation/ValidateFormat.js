define([], function(){
	return {
		validate: function(tests, args){
			if(typeof tests == 'string')
				tests = [tests];
			for(var i = 0; i < tests.length; i++){
				var test = tests[i];
				if(typeof this[test] == "function" && !this[test](args)){
					return {success:false, msg:test};
				}
			}
			return {success:true};
		},

		isEmail: function(str){
			return str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
		}
	}
});