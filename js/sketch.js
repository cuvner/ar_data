let riverNamesData = []; // Array to store the raw data from the file
let riverNames = []; // Array to store RiverName objects
const maxRiverNames = 50; // Maximum number of river names to display at once
let customFont; // Variable to hold the custom font
let arLayer; // Off-screen graphics buffer

class RiverName {
    constructor(name) {
        this.name = name;
        this.reset();
        this.noiseOffsetX = random(1000);
        this.noiseOffsetY = random(1000);
    }

    reset() {
        this.x = random(arLayer.width);
        this.y = random(arLayer.height);
        this.z = random(200, 600); // Initial z position set further back
    }

    update() {
        this.x += map(noise(this.noiseOffsetX), 0, 1, -2, 2);
        this.y += map(noise(this.noiseOffsetY), 0, 1, -2, 2);
        this.noiseOffsetX += 0.01;
        this.noiseOffsetY += 0.01;
        this.z -= 2; // Speed of coming towards the viewer

        // Reset position when it moves out of view
        if (this.z < 1) {
            this.reset();
        }
    }

    displayOn(buffer) {
        let size = map(this.z, 0, arLayer.width, 16, 1);
        buffer.push();
        buffer.textSize(size);
        buffer.fill(0);
        buffer.text(this.name, this.x, this.y);
        buffer.pop();
    }
}

function preload() {
    riverNamesData = loadStrings('river_names_filtered.txt');
    customFont = loadFont('CourierBold.ttf'); // Update with the path to your font file
}

function setup() {
  noCanvas()

	arLayer = createGraphics(895, 1280, document.getElementById('canvas-ar'))
    arLayer.pixelDensity(1); // Set pixel density
    arLayer.textFont(customFont); // Set the custom font for the off-screen buffer
    arLayer.textAlign(CENTER, CENTER);

    // Initialize the first set of river names
    for (let i = 0; i < min(maxRiverNames, riverNamesData.length); i++) {
        riverNames.push(new RiverName(riverNamesData[i]));
    }
}

function draw() {
   

    // Update and display river names on the off-screen buffer
    for (let riverName of riverNames) {
        riverName.update();
        riverName.displayOn(arLayer);
    }

    // Add new names if there are less than the maximum on screen
    if (riverNames.length < maxRiverNames) {
        let nextIndex = riverNames.length;
        if (nextIndex < riverNamesData.length) {
            riverNames.push(new RiverName(riverNamesData[nextIndex]));
        }
    }

    // Display the off-screen buffer contents on the main canvas
    // image(arLayer, 0, 0);
}
