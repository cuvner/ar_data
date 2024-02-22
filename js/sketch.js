let riverNamesData = []; // Array to store the raw data from the file
let riverNames = []; // Array to store RiverName objects
const maxRiverNames = 50; // Maximum number of river names to display at once
let customFont; // Variable to hold the custom font
let arLayer;

class RiverName {
  constructor(name) {
    this.name = name;
    this.arLayer.reset();
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.z = random(200, 600); // Initial z position set further back
  }

  update() {
    this.x += map(noise(this.noiseOffsetX), 0, 1, -2, 2);
    this.y += map(noise(this.noiseOffsetY), 0, 1, -15, 15);
    this.noiseOffsetX += 0.01;
    this.noiseOffsetY += 0.01;
    this.z -= 5; // Speed of coming towards the viewer

    // Reset position when it moves out of view
    if (this.z < 1) {
      this.arLayer.reset();
    }
  }

  display() {
    let size = map(this.z, 0, width, 32, 1);
    arLayer.textSize(size);
    arLayer.fill(0);
    arLayer.text(this.name, this.x, this.y);
  }
}

function preload() {
  riverNamesData = loadStrings("river_names_filtered.txt");
  customFont = loadFont("CourierBold.ttf"); // Update with the path to your font file
}

function setup() {
  //createCanvas(1912, 1912, document.getElementById('canvas-ar')) // poster aspect
	noCanvas()

  arLayer = createGraphics(1912, 1912, document.getElementById('canvas-ar'))
  
  arLayer.pixelDensity(1) // prevent 200+ PPI lag
  arLayer.textFont(customFont); // Set the custom font
  arLayer.textAlign(CENTER, CENTER);
  arLayer.frameRate(30); // Throttle the frame rate for performance

  // Initialize the first set of river names
  for (let i = 0; i < min(maxRiverNames, riverNamesData.length); i++) {
    riverNames.push(new RiverName(riverNamesData[i]));
  }
}

function draw() {
  //background(255);
  arLayer.translate(width / 2, height / 2);
  // Update and display river names
  for (let riverName of riverNames) {
    riverName.update();
    riverName.display();
  }

  // Add new names if there are less than the maximum on screen
  if (riverNames.length < maxRiverNames) {
    let nextIndex = riverNames.length;
    if (nextIndex < riverNamesData.length) {
      riverNames.push(new RiverName(riverNamesData[nextIndex]));
    }
  }
}
