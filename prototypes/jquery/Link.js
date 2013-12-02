$.fn.goTo = function(uri){
	if(!this.is('a')){
		return;
	}
	this.attr('href', uri);
	var me = this;
	this.click(function(evt){
		App.router.navigate(uri);
	});
};


