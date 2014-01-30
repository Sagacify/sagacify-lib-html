$.fn.goTo = function(aliasOrRoute, args){

	var route = App.router.aliases[aliasOrRoute] != null ? App.router.aliases[aliasOrRoute] : aliasOrRoute;
	if(args) {
		for(var key in args) {
			if(route.contains(':'+key)){
				route = route.replace(':'+key, args[key]);
			}
		}
	}
	
	if(this.is('a')){
		this.attr('href', route);
	}
	
	var me = this;
	this.click(function(evt){
		App.router.navigate(route);
	});
};