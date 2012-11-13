var profile = (function(){

    copyOnly = function(filename, mid){
            var list = {
                "app/app.profile": true,
                // we shouldn't touch our profile
                "app/package.json": true
                // we shouldn't touch our package.json
            };
            return (mid in list) ||
                (/^app\/resources\//.test(mid)
                    && !/\.css$/.test(filename)) ||
                /(png|jpg|jpeg|gif|tiff)$/.test(filename);
            // Check if it is one of the special files, if it is in
            // app/resource (but not CSS) or is an image
    };

	return {
		resourceTags:{
            copyOnly: function(filename, mid){
                return copyOnly(filename, mid);
                // Tag our copy only files
            },
 
            amd: function(filename, mid){
                return !copyOnly(filename, mid)
                    && /\.js$/.test(filename);
                // If it isn't a test resource, copy only,
                // but is a .js file, tag it as AMD
            }
		}
	};
})();
