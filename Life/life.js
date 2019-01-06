const width = 800;
const height = 520;
//const diff = 75;

let grid;
let cols;
let rows;
let waitTime = 100;
let tickPressed = false;
let started = true;
let first = true;

let growthAge;
let oldnessAge;
let dyingAge;

let oldOn;

function setup() {
	if (first) {

		canvas = createCanvas(width, height);
		canvas.position(300, 10);

		createP("Выбрать разрешение:").id("resol");
		resolSelect = createSelect();

		startBtn = createButton("Стоп").id("startBtn");
		startBtn.mousePressed(start);

		tickBtn = createButton("Один шаг");
		tickBtn.mousePressed(function() {
			tickPressed = true;
		});

		clearBtn = createButton("Очистить поле");
		clearBtn.mousePressed(clearCanvas);

		randomBtn = createButton("Случайно заполнить");
		randomBtn.mousePressed(setRandom);

		saveBtn = createButton("Сохранить картинку");
		saveBtn.mousePressed(canvasToPng);
		
		resolSelect.option(40);
		resolSelect.option(20);
		resolSelect.option(10);
		resolSelect.option(4);
		resolSelect.option(2);
		resolSelect.changed(setup);

		createP("Включить старение");
		ageSlider = createSlider(0, 1, 0, 1);

		createP("Время взросления: 0").id("growthAge");
		growthSlider = createSlider(0, 5, 0, 1);

		createP("Длина репродуктивного периода: 10").id("reproductiveAge");
		reproductiveAgeSlider = createSlider(1, 20, 8, 1);

		createP("Длина жизни в старости: 3").id("oldnessLength");
		dyingSlider = createSlider(0, 10, 2, 1);

		createP("Длина жизни клеток: 13").id("deathAge");
		
		createP("Включить случайность");
		randomnessSlider = createSlider(0, 1, 0, 1);
		
		first = false;

	}

	resolution = resolSelect.value();
	

	cols = width / resolution;
	rows = height / resolution;

	grid = create2DArray(rows);

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j] = new Cell;
			grid[i][j].state = floor(random(2));
		}
	}
	
}

function draw() {

	background(51);
	stroke(255);

	oldOn = boolean(ageSlider.value());
	let randomnessOn = boolean(randomnessSlider.value());
	
	growthAge = growthSlider.value();
	oldnessAge = growthAge + reproductiveAgeSlider.value();
	dyingAge = oldnessAge + dyingSlider.value();


	growthP = document.getElementById("growthAge")
	growthP.innerHTML = "Время взросления: " + growthSlider.value();
	
	reproductiveAgeP = document.getElementById("reproductiveAge")
	reproductiveAgeP.innerHTML = "Длина репродуктивного периода: " + reproductiveAgeSlider.value();
	
	oldnessLengthP = document.getElementById("oldnessLength")
	oldnessLengthP.innerHTML = "Длина жизни в старости: " + dyingSlider.value();

	deathP = document.getElementById("deathAge")
	deathP.innerHTML = "Длина жизни клеток: " + dyingAge;

	if (!oldOn) {
		growthP.style.color = "#aaa";
		reproductiveAgeP.style.color = "#aaa";
		oldnessLengthP.style.color = "#aaa";
		deathP.style.color = "#aaa";
	} else {
		growthP.style.color = "#000";
		reproductiveAgeP.style.color = "#000";
		oldnessLengthP.style.color = "#000";
		deathP.style.color = "#000";
	}


	let liveCells = 0;

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let x = j*resolution;
			let y = i*resolution;

			if(grid[i][j].state == 1) {

				liveCells++;

				let opacity = 255 * grid[i][j].age / dyingAge;
				
				if(grid[i][j].nature == "random") {
					fill(255, 100, 100, 255 - opacity);	
				} else fill(255, 255, 255, 255 - opacity);	

				stroke(225);
				rect(x, y, resolution-1, resolution -1);

				grid[i][j].nature = "natural";

			}
		}
	}

	let cells = cols * rows;
	let alive = floor(liveCells/cells); // число от 0 до 1, ндо умножить на длину

	fill(150, 20, 88);
	rect (width + 25, 0, 50, alive*height); //не работает


	tick = function() {

		next = create2DArray(rows);

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {

				next[i][j] = new Cell;
				
				let state = grid[i][j].state;

				let neighbors = countLiveNeighbors(grid, i, j);

				if (neighbors < 2 || neighbors > 3 || (oldOn & grid[i][j].age == dyingAge)) {
					next[i][j].state = 0;
				} else if (state == 0 && neighbors == 3 ) {
					next[i][j].state = 1;
				} else if(state == 1 && (neighbors == 2 || neighbors == 3)) {
					next[i][j].state = state;
					if (oldOn) next[i][j].age = grid[i][j].age + 1;
				} else {
					next[i][j].state = state;
				}
			}
		}

		wait(waitTime);

		grid = next;
	}

	if (tickPressed || started) {
		tick();
		if (randomnessOn) {
			randomRain(1 / (rows * cols ));
		}
		tickPressed = false;
	}
	

}


function mousePressed() {

	let overCanvas = false;
	if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) overCanvas = true;
	
	if (overCanvas) {

		y = int(mouseX / resolution);
		x = int(mouseY / resolution);

		if (oldOn && grid[x][y].state == 1) {
			//grid[x][y].state = 0;
			grid[x][y].age += 1;
		} else {
			grid[x][y].state == 1 ? grid[x][y].state = 0 : grid[x][y].state = 1;
		}

		if (grid[x][y].age == dyingAge) {
			grid[x][y].state = 0;
			grid[x][y].age = 0;
		}

	}
}

function doubleClicked() {

	console.log("double click works");

	let overCanvas = false;
	if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) overCanvas = true;
	
	if (overCanvas) {

		y = int(mouseX / resolution);
		x = int(mouseY / resolution);

		if (oldOn && grid[x][y].state == 1) {
			grid[x][y].state = 0;
			grid[x][y].age = 0;
		}
	}
}

function canvasToPng() {
	saveCanvas("life.png");
}

function create2DArray(rows) {
	let arr = [];

	for (let i = 0; i < rows; i++) {
		arr[i] = [];
	}

	return arr;
}

function countLiveNeighbors(grid, x, y) {
	let sum = 0;

	for(let i = -1; i < 2; i++) {
		for(let j = -1; j < 2; j++) {
			
			let row = (x + i + rows) % rows; //Замыкает плоскость в тор
			let col = (y + j + cols) % cols;
			
			if((oldOn && (grid[row][col].age >= growthAge && grid[row][col].age < oldnessAge)) || !oldOn) {
				sum += grid[row][col].state;
			}
		}

	}

	sum -= grid[x][y].state;

	return sum;
}

function wait(ms) {
	let start = new Date().getTime();
	
	while (true) {
		if((new Date().getTime() - start) > ms) {
			break;
		}
	}
}

function clearCanvas() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j].state = 0;
			grid[i][j].age = 0;
		}
	}
}


function setRandom() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j].state = floor(random(2));
			if (oldOn) {
				grid[i][j].age = floor(random(oldnessAge));
			}
		}
	}
}



function randomRain(chance) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if(random(1) < chance) {
				grid[i][j].state == 1 ? grid[i][j].state = 0 : grid[i][j].state = 1;
				grid[i][j].nature = "random";
			}
		}
	}


}

class Cell {
	constructor() {
		this.age = 0;
		this.state = 0;
		this.nature = "natural";
	}
}

function start() {

	started = !started;

	btn = document.getElementById("startBtn");
	started ? btn.innerHTML = "Стоп" : btn.innerHTML = "Старт";
}