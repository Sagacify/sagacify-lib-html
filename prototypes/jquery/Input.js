$.fn.sgRenderImage = function (img) {
	if (this.is('input') && (this.attr('type') == 'file')) {
		this.change(function (evt) {
			if (this.files && this.files[0]) {
				var fr = new FileReader();
				fr.onload = function (evt) {
					$(img).attr('src', evt.target.result);
				};
				fr.readAsDataURL(this.files[0]);
			}
		});
	}
};

$.fn.valChange = function (val) {
	if (val != $(this).val())
		return $(this).val(val).change();
	else
		return $(this);
};