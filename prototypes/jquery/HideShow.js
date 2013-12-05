// var _hide = $.fn.hide;
// $.fn.hide = function(speed, callback) {
// 	$(this).trigger('jQHide');
// 	return _hide.apply(this,arguments);
// };

var _show = $.fn.show;
$.fn.show = function(speed, callback) {
	$(this).trigger('jQShow');
	return _show.apply(this,arguments);
};