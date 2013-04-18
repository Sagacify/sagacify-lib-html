define([
	"dojo/_base/xhr",
	"dojo/_base/declare",
	"saga/stores/JsonStore",
	"dojo/Deferred",
	"dojo/_base/json",
	"./UrlManager"], 
	function(xhr, declare, JsonStore, Deferred, json, UrlManager) {
	
	return declare("Store.JsonStore", [JsonStore], {
		
		login: function(success, failure){
			this.post(UrlManager.userLogin(), {username:localStorage.username, password:localStorage.password}, {}).then(
				function(data){
					localStorage.username = username;
					localStorage.password = password;
					localStorage.access_token = data.token;
					success(data);
				},
				function(error){
					localStorage.removeItem("username");
					localStorage.removeItem("password");
					localStorage.removeItem("token");
					failure(error);
			});
		},
		
		loginFail: function(){
			History.pushState(null, null, "/admin/login");
		}	
	});
});
	