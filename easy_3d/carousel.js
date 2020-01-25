// carousel
var images = document.getElementsByClassName('my-carousel-img');
var i = 0;

change_image = function(is_forward) {
	current_image = images[i];
	current_image.classList.remove("active");
	current_image.classList.add("inactive");

	if (is_forward) {
		i = (i < images.length - 1) ? i+1 : 0;
	} else {
		i = (i > 0) ? i-1 : images.length - 1;
	}

	next_image = images[i];
	next_image.classList.remove("inactive");
	next_image.classList.add("active");
}

carousel = document.getElementById("my-carousel");

var x;
var y;

const OFFSET = 25;

carousel.ondragstart = function() {
	return false;
}

carousel.onmousedown = function(e) {
	x = e.pageX;
	y = e.pageY;

	carousel.onmousemove = function(e) {
		if(x - event.pageX > OFFSET) {
			change_image(true);
			x = event.pageX;
			y = event.pageY;
		}
		else if(event.pageX - x > OFFSET) {
			change_image(false);
			x = event.pageX;
			y = event.pageY;
		}

	document.onmouseup = function() {
		carousel.onmousemove = null;
	}

}
