"use strict";

let WIDTH = 1200;
let HEIGHT = 800;
let SQUARE = 400;


let button = {
    idle: "",
    pressed: ""
}
let vhsFont = "";

let sideColours = [];

function preload()
{
    button.idle = loadImage("assets/images/buttonIdle.png");
    button.pressed = loadImage("assets/images/buttonPressed.png");
    vhsFont = loadFont("assets/Vhs.ttf");
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
    let elapsed = (millis() - startTimer) / 1000;
    timeLeft = max(0, timerLength - elapsed);
    translate(WIDTH / 3 * 2, HEIGHT / 2)
    fill(0);
    textSize(80);
    textFont(vhsFont)
    text(Math.ceil(timeLeft), SQUARE / 3, 100)

    image(button.idle, SQUARE / 3, SQUARE / 2)
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
        startTimer = millis();
    }
}