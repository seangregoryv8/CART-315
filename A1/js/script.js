"use strict";

let WIDTH = 1200;
let HEIGHT = 800;
let SQUARE = 400;


let button = {
    idle: "",
    pressed: "",
    dead: ""
}

let sounds = {
    beep: "",
    press: "",
    explode: ""
}
let vhsFont = "";

let buttonOffset =  { x: 65, y: 100 };
let sideColours = [];
let isMouseOverButton = false;
let isMousePressed = false;
let buttonCenterX = WIDTH / 3 * 2 + (buttonOffset.x * 3);
let buttonCenterY = HEIGHT / 2 + (buttonOffset.y * 3);
let buttonSize = 400;
let lastSecondPlayed = -1;
let timerFinished = false;

function preload()
{
    button.idle = loadImage("assets/images/buttonIdle.png");
    button.pressed = loadImage("assets/images/buttonPressed.png");
    button.dead = loadImage("assets/images/buttonDead.png");
    vhsFont = loadFont("assets/Vhs.ttf");

    sounds.beep = loadSound("assets/sounds/timer.mp3");
    sounds.press = loadSound("assets/sounds/button.mp3");
    sounds.explode = loadSound("assets/sounds/explode.mp3");
}

function setup()
{
    createCanvas(WIDTH, HEIGHT);
    background(0);

    let shuffled = [...colours];
    for (let i = shuffled.length - 1; i > 0; i--) 
    {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // grab the first 6
    sideColours = shuffled.slice(0, 6);


    startTimer = millis();
}

function draw()
{
    drawGrid();
    drawButtonPanel();
}

let isAnyTrapActive = false;
function drawButtonPanel()
{
    let elapsed = (millis() - startTimer) / 1000;
    timeLeft = max(0, timerLength - elapsed);
    
    // Detect when timer ticks (each second)
    let currentSecond = Math.ceil(timeLeft);
    if (currentSecond !== lastSecondPlayed && timeLeft > 0)
    {
        lastSecondPlayed = currentSecond;
        if (currentSecond > 10)
        {
            if (currentSecond % 5 === 0 && currentSecond != timerLength) sounds.beep.play();
        }
        else if (sounds.beep) sounds.beep.play();
    }
    
    // Detect when timer reaches 0
    if (timeLeft === 0 && !timerFinished) {
        timerFinished = true;
        if (sounds.explode) sounds.explode.play();
    }
    
    // Reset timer finished flag when new game starts
    if (timeLeft > 0) {
        timerFinished = false;
    }
    
    translate(WIDTH / 3 * 2, HEIGHT / 2)
    fill(0);
    textSize(80);
    textFont(vhsFont)
    text(Math.ceil(timeLeft), buttonOffset.x * 2.25, buttonOffset.y + 30);

    scale(3);
    imageMode(CENTER);
    
    let distance = dist(mouseX, mouseY, buttonCenterX, buttonCenterY);
    isMouseOverButton = distance < (buttonSize / 4);
    
    image(isMouseOverButton && isMousePressed ? button.pressed : isAnyTrapActive ? button.dead : button.idle, buttonOffset.x, buttonOffset.y);
}


function drawGrid()
{
    push();
    let index = 0;
    for (let i = 0; i < WIDTH / SQUARE; i++)
    {
        for (let j = 0; j < HEIGHT / SQUARE; j++)
        {
            fill(sideColours[index])
            rect(i * SQUARE, j * SQUARE, SQUARE, SQUARE);
            index++;
        }
    }
    pop();
}

function keyPressed()
{
    if (keyIsPressed && key == " ")
    {
        isAnyTrapActive = !isAnyTrapActive;
    }
}

function mouseReleased()
{
    isMousePressed = false;
}

function mousePressed()
{
    if (isMouseOverButton && !isAnyTrapActive)
    {
        sounds.press.play();
        isMousePressed = true;
        startTimer = millis();
        return false;
    }
}