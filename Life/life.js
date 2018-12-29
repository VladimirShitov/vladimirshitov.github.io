const width = 600;
const height = 400;

let grid;
let cols;
let rows;
let waitTime = 100;
let tickPressed = false;
let started = true;
let first = true;

function setup() {
	if (first) {

		canvas = createCanvas(width, height);
		//canvas.center("horizontal");	
	
		canvas.position(300, 10);

		startBtn = createButton("Старт/стоп");
		startBtn.mousePressed(function(){
			text("pew");
			started = !started;
		});

		tickBtn = createButton("Один шаг");
		tickBtn.mousePressed(function() {
			tickPressed = true;
		});

		clearBtn = createButton("Очистить поле");
		clearBtn.mousePressed(clearCanvas);

		randomBtn = createButton("Случайно заполнить");
		randomBtn.mousePressed(setRandom);

		saveBtn = createButton("Сохранить png");
		saveBtn.mousePressed(canvasToPng);

		createP("Выбрать разрешение:");

		resolSelect = createSelect();
		
		resolSelect.option(40);
		resolSelect.option(20);
		resolSelect.option(10);
		resolSelect.option(4);
		resolSelect.changed(setup);

		first = false;

	}

	resolution = resolSelect.value();
	

	cols = width / resolution;
	rows = height / resolution;

	grid = create2DArray(rows);

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j] = floor(random(2));
		}
	}

	
}

function draw() {
	background(51);
	stroke(255);

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let x = j*resolution;
			let y = i*resolution;

			if(grid[i][j] == 1) {
				fill(255);
				stroke(0);
				rect(x, y, resolution-1, resolution -1);
			}
		}
	}

	tick = function() {

		next = create2DArray(rows);

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				
				let state = grid[i][j];

				let neighbors = countLiveNeighbors(grid, i, j);

				if (neighbors < 2 || neighbors > 3) {
					next[i][j] = 0;
				} else if (neighbors == 3 ) {
					next[i][j] = 1;
				} else {
					next[i][j] = state;
				}
			}
		}

		wait(waitTime);

		grid = next;
	}

	if (tickPressed || started) {
		tick();
		tickPressed = false;
	}
	

}


function mousePressed() {
	let overCanvas = false;
	if (mouseX < width && mouseY < height) overCanvas = true;
	if (overCanvas) {

		y = int(mouseX / resolution);
		x = int(mouseY / resolution);

		console.log(mouseX, mouseY);
		console.log(x, y);

		grid[x][y] == 1 ? grid[x][y] = 0 : grid[x][y] = 1;
	}
}

function canvasToPng() {
	saveCanvas("fractal.png");
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
			sum += grid[row][col];
		}

	}

	sum -= grid[x][y];

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
			grid[i][j] = 0;
		}
	}
}


function setRandom() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j] = floor(random(2));
		}
	}
}



