
define([ 'dojo/has', 'require' ], function (has, require) {
	var app = {};

	if (has('host-browser')) {
			
		require(['./widgets/Application', './config/Config', 'dojo/window', 'saga/widgets/mobile/Logger', 'saga/widgets/mobile/TableViewController', 'dojo/domReady!' ], function (Application, Config, win) {
			Config.setup();
			
			//window.addEventListener('storage', function(evt){alert("ok")}, false)
			startupQueue = [];
			startup = function(){
        		dojo.forEach(startupQueue, function(objectToStart) {
	        		objectToStart.startup();
	        	});
	        	startupQueue.splice(0, startupQueue.length);
        	}
			var app = new Application();
        	app.placeAt(document.body);
        	
        	startup();
        	
        	localStorage.setItem("test", "test");
			
		});
	}
	else {
		// TODO: Eventually, the Boilerplate will actually have a useful server implementation here :)
		console.log('Hello from the server!');
	}
});