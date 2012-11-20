define(['dojo/_base/declare', 'dojo/_base/xhr', 'dojo/Evented'], function(declare, xhr, Evented){

	return declare('bizcomp.store.Store', [Evented], {
		
		_synchronizationURI: null,
		
		_data: null,
		
		constructor: function(args) {
			if(args) {
				this._synchronizationURI = args.synchronizationURI;
			}
		},
		
		synchronize: function() {
			var me = this;
			xhr.get({
		    
	    		url: this._synchronizationURI,
	    			    		
	    		handleAs:"json",
	    
	    		load: function(jsonData) {
	    			//console.log(dojo.toJson(jsonData));
	    			me._data = jsonData;
	    	    	me.emit("storeSynchronizationFinished", {data:jsonData});
	    		}
			});
		}
	
	});

});

