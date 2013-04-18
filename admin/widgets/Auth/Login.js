define([
	"dojo/_base/declare", 
	"saga/widgets/_Widget",
	"dojo/text!./templates/Login.html",
	"admin/stores/UserStore",
	"dojo/on",
	"dojo/dom-construct",
	"dojo/json"],
    function(declare, _Widget, template, UserStore, on, domConstruct, json) {
     return declare('mbe.Login', [_Widget], {
     	
     	templateString: template,
    		        	        	        	        	
    	constructor: function(args) {
    		
    	},
    	
    	postCreate: function() {
    		/*if(localStorage.username && localStorage.password){
    			this.login(localStorage.username, localStorage.password);
    			return;
    		}*/
    		
    		if(sessionStorage.placeToCreate){
    			domConstruct.create("label", {innerHTML:"About to create your place..."}, this.domNode, "first");
    		}
    			
    		var me = this;
			on(this.okButton, "click", function(args){
				me.login(me.usernameNode.value, me.passwordNode.value);
			});
			
			on(this.registerButton, "click", function(args){
				History.pushState(null, null, "/admin/register/");
			});
    	},
    	
    	login: function(username, password){		
			if(!username){
				alert("You must enter a username");
				return;
			}
			
			if(!password){
				alert("You must enter a password");
				return;
			}
				
			var userStore = UserStore.singleton();
			userStore.login(username, password).then(
				function(data){
					console.log(data);
					localStorage.username = username;
					localStorage.password = password;
					localStorage.access_token = data.token;
					History.pushState(null, null, "/admin");
				},
				function(error){
					console.log('Error on login ...');
					console.log(error);
					localStorage.removeItem("username");
					localStorage.removeItem("password");
					localStorage.removeItem("access_token");
			});
    	}
    });
}); 