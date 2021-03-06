$(function () {
	var box = $("body");
	var husk = $(".husk-container");

	$(document).mousemove(function (e) {
		var boxCenter = [box.offset().left + box.width() / 2, box.offset().top + box.height() / 2];
		var angle = Math.atan2(e.pageX - boxCenter[0], -(e.pageY - boxCenter[1])) * (180 / Math.PI);
		angle = angle / 5;
		husk.css({"transform": 'rotateX(' + angle + 'deg) rotateX(' + angle + 'deg) rotateZ(' + angle + 'deg)'});
	});

	randomizeAll();
});


function randomizeAll(){
	for(let i = 0; i < 100000; i++){
		setTimeout(function(){
			const letter = $('.letter');
			const letterBorder = $('.letter.hb,.letter.ub,.letter.sb,.letter.kb');
			randomizeBackgroundColor(letter);
			randomizeBackgroundColor(letterBorder);
		},1000 * i);
	}
}

function randomizeBackgroundColor(selector){
	randomize('background-color', selector);
}

//by Paul Irish
function randomize(prop, selector){
	selector.css(prop,'#'+Math.floor(Math.random()*16777215).toString(16));
}
