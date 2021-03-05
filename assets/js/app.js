$(function () {
	var box = $("body");
	var husk = $(".husk-container");

	$(document).mousemove(function (e) {
		var boxCenter = [box.offset().left + box.width() / 2, box.offset().top + box.height() / 2];
		var angle = Math.atan2(e.pageX - boxCenter[0], -(e.pageY - boxCenter[1])) * (180 / Math.PI);
		angle = angle / 5;
		husk.css({"transform": 'rotateX(' + angle + 'deg) rotateZ(' + angle + 'deg)'});
	});
});
