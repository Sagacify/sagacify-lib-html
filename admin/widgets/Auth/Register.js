define([
	"dojo/_base/declare", 
	"saga/widgets/_Widget",
	"dojo/text!./templates/Register.html",
	"admin/stores/UserStore",
	"dojo/on"],

    function(declare, _Widget, template, UserStore, on) {
    	
     return declare('admin.Register', [_Widget], {
     	
     	templateString: template,
    		        	        	        	        	
    	constructor: function(args) {
    		
    	},
    	
    	postCreate: function() {
			var me = this;
			on(this.registerButton, "click", function(args){
				var username = me.usernameNode.value;
				var password = me.passwordNode.value;
				
				if(!username){
					alert("You must enter a username");
					return;
				}
				
				if(!password){
					alert("You must enter a password");
					return;
				}
				me.register(username, password);
			});
    	},
    	
    	register: function(username, password){		
			
			var me = this;
			var userStore = UserStore.singleton();
			userStore.register(username, password).then(
				function(data){
					localStorage.username = username;
					localStorage.password = password;
					localStorage.access_token = data.token;
					me.login(username, password);
				},
				function(error){
					console.log('Error on register ...');
					console.log(error);
					localStorage.removeItem("username");
					localStorage.removeItem("password");
					localStorage.removeItem("access_token");
			});
    	},
    	
    	login: function(username, password){		
			var userStore = UserStore.singleton();
			userStore.login(username, password).then(
				function(data){
					localStorage.username = username;
					localStorage.password = password;
					localStorage.access_token = data.token;
					History.pushState(null, null, "/admin/");
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