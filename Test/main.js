
define([ 'dojo/has', 'require' ], function (has, require) {
    var app = {};

    if (has('host-browser')) {
        
        require(['dojo/domReady!'], function () {
        	
        	document.body.innerHTML = "testlib";
			   	
        });
    }
    else {
        console.log('Server problem!');
    }

    return app;
});