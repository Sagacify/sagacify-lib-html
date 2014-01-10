$.fn.goTo = function(aliasOrRoute, args){
	if(!this.is('a')){
		return;
	}
	var route = App.router.aliases[aliasOrRoute]!=null?App.router.aliases[aliasOrRoute]:aliasOrRoute;
	if(args){
		for(key in args){
			if(route.contains(':'+key)){
				route = route.replace(':'+key, args[key]);
			}
		}
	}
	
	this.attr('href', route);
	var me = this;
	this.click(function(evt){
		App.router.navigate(route);
	});
};


