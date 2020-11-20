var food = [];
var finders = [];

var newFoodChance = .06;
const MUTATIONRATE = 0.1;
const MUTATIONAMOUNT = 0.3;

var input;
var saveButton;
var saveData;

var showStats = false;

function setup() {
  // put setup code here
  let canvas = createCanvas(600, 600);
  canvas.parent('sketch');
  for(let i = 0; i < 40; i++) {
  	food.push(new Food());
  }
  for(let i = 0; i < 5; i++) {
  	finders.push(new Finder(random(width), random(height)));
  }
  let br = createElement('br');
  br.parent('sketch');
  saveButton = createButton('Save Simulation');
  saveButton.mousePressed(saveSim);
  saveButton.parent('sketch');
  let label = createElement('label',  " Load Save: ");
  label.parent('sketch');
  input = createFileInput(handleFile);
  input.parent('sketch');
}

function draw() {
  // put drawing code here
  if(random(1) < newFoodChance) {
    food.push(new Food());
  }
  background(200);
  for (let i = 0; i < food.length; i++) {
  	food[i].act();
  }
  for(let i = 0; i < food.length; i++) {
  	if(food[i].eaten) {
  		food.splice(i,1);
  	}
  }
  for(let i = 0; i < finders.length; i++) {
  	finders[i].act();
    if(finders[i].dead) {
      finders.splice(i, 1)
    }
  }
  showInfo();
}

function keyPressed() {
  if(key == 's') {
    showStats = !showStats;
  }
}

function saveSim() {
  var out = [];
  for(let i = 0; i < finders.length; i++) {
    f = finders[i];
    out.push(f.x + "," + 
      f.y + "," + 
      f.vel + "," + 
      f.detectionRadius + "," + 
      f.breedAllowance + "," + 
      f.energyGiven + "," + 
      f.breedDistance + "," + 
      f.energy + "," + 
      f.eatRadius);
  }
  saveStrings(out, "NaturalSelectionSimulatorSave.txt");
}

function handleFile(file) {
  console.log("Called");
  try {
    saveData = split(file.data, '\n');
    finders = [];
    for(let i = 0; i < saveData.length; i++) {
      var c = split(saveData[i], ',');
      for(let j = 0; j < c.length; j++) {
        c[j] = Number(c[j]);
      }
      console.log(c);
      var f = new Finder(c[0], c[1]);
      f.vel = c[2];
      f.detectionRadius = c[3];
      f.breedAllowance = c[4];
      f.energyGiven = c[5];
      f.breedDistance = c[6];
      f.energy = c[7];
      f.eatRadius = c[8];
      console.log(f);
      finders.push(f);
    }
    food = [];
    for(let i = 0; i < 40; i++) {
      food.push(new Food());
    }
  } catch(e) {
    window.alert("Not a valid save file.");
  }
}

function showInfo() {
  let string = "Press \'s\' to show stats.";
  if(showStats) {
    fill(0);
    textAlign(LEFT, TOP);
    textSize(15);
    text("Statistics:", 5, 5);
    text("Average vision range: " + averageViewDistance(), 5, 20);
    text("Average speed: " + averageSpeed(), 5, 35);
    text("Average eat reach: " + averageEatDistance(), 5, 50);
    text("Average breed reach: " + averageBreedDistance(), 5, 65);
    text("Average minimum breeding energy: " + averageBreedAllowance(), 5, 80);
    text("Average energy given to children: " + averageEnergyGiven(), 5, 95);
    string = "Press \'s\' to hide stats.";
  }
  textAlign(RIGHT, BOTTOM);
  fill(0);
  textSize(15);
  text(string, width-5, height-5);
}

function averageViewDistance() {
  let total = 0;
  for(let i = 0; i < finders.length; i++) {
    total += finders[i].detectionRadius;
  }
  return total/finders.length;
}

function averageSpeed() {
  let total = 0;
  for(let i = 0; i < finders.length; i++) {
    total += finders[i].vel;
  }
  return total/finders.length;
}

function averageEatDistance() {
  let total = 0;
  for(let i = 0; i < finders.length; i++) {
    total += finders[i].eatRadius;
  }
  return total/finders.length;
}

function averageBreedDistance() {
  let total = 0;
  for(let i = 0; i < finders.length; i++) {
    total += finders[i].breedDistance;
  }
  return total/finders.length;
}

function averageBreedAllowance() {
  let total = 0;
  for(let i = 0; i < finders.length; i++) {
    total += finders[i].breedAllowance;
  }
  return total/finders.length;
}

function averageEnergyGiven() {
  let total = 0;
  for(let i = 0; i < finders.length; i++) {
    total += finders[i].energyGiven;
  }
  return total/finders.length;
}

