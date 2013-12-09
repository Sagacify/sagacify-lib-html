var _show = $.fn.show;
$.fn.show = function(speed, callback) {
	var chain = _show.apply(this, arguments);
	$(this).trigger('jQShow');
	return chain;
};