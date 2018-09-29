const PI = 3.14159265359,
	  side = 400;

let angle,
	koef,
	angleSlider,
	koefSlider,
	seed;

function setup() {
	createCanvas(side, side);

	createP("Угол поворота");
	angleSlider = createSlider(0, PI * 0.75, PI/4, 0.01);

	createP("Размер следующей ветки");
	koefSlider = createSlider(0, 0.70, 0.67, 0.01);

	createP("Добавить случайность");
	randSlider = createSlider(0, 1, 0);

	saveBtn = createButton("Сохранить изображение");
	saveBtn.class("savy");
	saveBtn.mousePressed(canvasToPng);

	seed = Math.random() / 2 * randSlider.value();
}

function draw() {
	background(51);
	angle = angleSlider.value();
	koef = koefSlider.value();

	stroke(255);
	translate(side / 2, height);
	branch(side / 4);
}

function branch(len) {
	k=0;
	line(0, 0, 0, -len);
	translate(0, -len);
	if (len > 4) {
		push();
		rotate(angle * koef + seed);
		branch(len * koef);
		pop();

		push();
		rotate(-angle * koef);
		branch(len * koef + seed);
		pop();
	}
}


function mousePressed() {
	let overCanvas = false;
	if (mouseX < side && mouseY < side) overCanvas = true;
	if (overCanvas) seed = Math.random() / 2  * randSlider.value();
}

function canvasToPng() {
	saveCanvas("fractal.png");
}


