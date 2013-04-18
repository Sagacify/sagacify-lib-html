define([
	'dojo/_base/declare', 
	'dojo/text!./config.json'],
	function(declare, configText){
		declare("Config", null, {
    		
		});
		
		Config.setup = function(){
			var config = dojo.fromJson(configText);
			//TODO: Utile de faire une differenciation entre un environement de dévelopement et de production
			//localStorage.serverPath = config.serverPath;
			localStorage.serverPath = "";
		};
		
    	return Config;
	}
);

