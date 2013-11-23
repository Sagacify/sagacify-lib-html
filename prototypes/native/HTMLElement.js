HTMLSelectElement.prototype.removeDefaultAtFirstChange = function () {
	$(this).one('change', function(){
		$(this).children().eq(0).remove();
	});
};