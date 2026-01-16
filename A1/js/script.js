"use strict";

let WIDTH = 1200;
let HEIGHT = 800;
let SQUARE = 400;

let traps = {
    numberPad: false,
    valve: false,
    exact: false
}

let button = {
    idle: "",
    pressed: "",
    dead: ""
}

let exactTrapSprites = 
{
    buttons:
    {
        oneUp: "",
        oneDown: "",
        speedUp: "",
        speedDown: ""
    },
    button:
    {
        idle: "",
        pressed: "",
        dead: ""
    }
}

let sounds = {
    beep: "",
    press: "",
    explode: "",
    steam: "",
    turn: "",
    circus: "",
    cringe: "",
    up: "",
    down: "",
    victory: ""
}

let vhsFont = "";

let buttonOffset =  { x: 65, y: 100 };
let sideColours = [];
let isMouseOverButton = false;
let isMousePressed = false;
let buttonCenterX = WIDTH / 3 * 2 + (SQUARE / 2);
let buttonCenterY = HEIGHT / 2 + (SQUARE / 2);
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
    sounds.steam = loadSound("assets/sounds/steam.mp3");
    sounds.turn = loadSound("assets/sounds/turn2.mp3");

    numberPad.sprites.idle = loadImage("assets/images/numberPad/np00.png");
    numberPad.sprites.one = loadImage("assets/images/numberPad/np01.png");
    numberPad.sprites.two = loadImage("assets/images/numberPad/np02.png");
    numberPad.sprites.three = loadImage("assets/images/numberPad/np03.png");
    numberPad.sprites.four = loadImage("assets/images/numberPad/np04.png");
    numberPad.sprites.five = loadImage("assets/images/numberPad/np05.png");
    numberPad.sprites.six = loadImage("assets/images/numberPad/np06.png");
    numberPad.sprites.seven = loadImage("assets/images/numberPad/np07.png");
    numberPad.sprites.eight = loadImage("assets/images/numberPad/np08.png");
    numberPad.sprites.nine = loadImage("assets/images/numberPad/np09.png");
    numberPad.sprites.zero = loadImage("assets/images/numberPad/np10.png");
    numberPad.sprites.enter = loadImage("assets/images/numberPad/np11.png");
    numberPad.sprites.dead = loadImage("assets/images/numberPad/np12.png");

    exactTrapSprites.button.idle = loadImage("assets/images/buttonHover/btnHover0.png");
    exactTrapSprites.button.pressed = loadImage("assets/images/buttonHover/btnHover1.png");
    exactTrapSprites.button.dead = loadImage("assets/images/buttonHover/btnHover2.png");
    exactTrapSprites.buttons.oneUp = loadImage("assets/images/buttons/btn0.png");
    exactTrapSprites.buttons.oneDown = loadImage("assets/images/buttons/btn2.png");
    exactTrapSprites.buttons.speedUp = loadImage("assets/images/buttons/btn1.png");
    exactTrapSprites.buttons.speedDown = loadImage("assets/images/buttons/btn3.png");

    numberPad.voice.zero = loadSound("assets/sounds/numbersVoice/zero.wav");
    numberPad.voice.one = loadSound("assets/sounds/numbersVoice/one.wav");
    numberPad.voice.two = loadSound("assets/sounds/numbersVoice/two.wav");
    numberPad.voice.three = loadSound("assets/sounds/numbersVoice/three.wav");
    numberPad.voice.four = loadSound("assets/sounds/numbersVoice/four.wav");
    numberPad.voice.five = loadSound("assets/sounds/numbersVoice/five.wav");
    numberPad.voice.six = loadSound("assets/sounds/numbersVoice/six.wav");
    numberPad.voice.seven = loadSound("assets/sounds/numbersVoice/seven.wav");
    numberPad.voice.eight = loadSound("assets/sounds/numbersVoice/eight.wav");
    numberPad.voice.nine = loadSound("assets/sounds/numbersVoice/nine.wav");
    numberPad.voice.correct = loadSound("assets/sounds/numbersVoice/dismissed.wav");
    numberPad.voice.incorrect = loadSound("assets/sounds/numbersVoice/wrong.wav");
    numberPad.voice.on = loadSound("assets/sounds/numbersVoice/active.wav");

    sounds.circus = loadSound("assets/sounds/circus2.mp3");
    sounds.cringe = loadSound("assets/sounds/cringe.mp3");
    sounds.up = loadSound("assets/sounds/up.wav");
    sounds.down = loadSound("assets/sounds/down.wav");
    sounds.victory = loadSound("assets/sounds/exactVictory2.mp3");
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
    drawNumberPad();
    drawValve();
    drawExact();

    isAnyTrapActive = false;
    for (let trap in traps)
    {
        if (traps[trap] == true) isAnyTrapActive = true;
    }
}

let isAnyTrapActive = false;
function drawButtonPanel()
{
    push();
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
    if (timeLeft > 0) timerFinished = false;
    
    translate(buttonCenterX, buttonCenterY)

    rectMode(CENTER);
    fill(0);
    rect(0, 125, 200, 100, 40);

    fill(255);
    textSize(80);
    textFont(vhsFont)
    textAlign(CENTER, CENTER);
    text(Math.ceil(timeLeft), 0, 125);

    scale(3);
    imageMode(CENTER);
    
    let distance = dist(mouseX, mouseY, buttonCenterX, buttonCenterY);
    isMouseOverButton = distance < (buttonSize / 4);
    
    noSmooth();
    image(isMouseOverButton && isMousePressed ? button.pressed : isAnyTrapActive ? button.dead : button.idle, 0, 0);
    pop();
}

function drawGrid()
{
    push();
    stroke(0);
    strokeWeight(6);
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
    if (keyIsPressed && key == "1")
    {
        isAnyTrapActive = !isAnyTrapActive;
    }
}

function stringToNumber(numStr)
{
    switch (numStr)
    {
        case "zero": return 0;
        case "one": return 1;
        case "two": return 2;
        case "three": return 3;
        case "four": return 4;
        case "five": return 5;
        case "six": return 6;
        case "seven": return 7;
        case "eight": return 8;
        case "nine": return 9;
    }
}

function mouseReleased()
{
    isMousePressed = false;
    valveMouseReleased();
    
    // Reset all numberPad pressed states
    if (numberPadEventRunning)
    {
        for (let key in numberPad.pressed)
        {
            if (numberPad.pressed[key])
            {
                let num = null;
                if (key != "idle" && key != "enter")
                {
                    num = stringToNumber(key);
                    solveNumberPad(num);
                }
                else if (key == "enter")
                {
                    checkNumberPadSolution();
                }
            }
            numberPad.pressed[key] = false;
        }
    }
    numberPad.pressed.idle = true;
    lastButtonPressed ="idle";
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
    if (exactEventRunning)
    {
        if (exactButtons.oneUp || exactButtons.speedUp) sounds.up.play();
        else if (exactButtons.oneDown || exactButtons.speedDown) sounds.down.play();
        
        if (exactButtons.oneUp)
            currentValue++;
        else if (exactButtons.oneDown)
            currentValue--;
        else if (exactButtons.speedUp)
            currentValue += 10;
        else if (exactButtons.speedDown)
            currentValue -= 10;

        if (currentValue < 0) currentValue = 0;
        if (currentValue > 99) currentValue = 99;
        if (exactButtons.main)
        {
            isMousePressed = true;
            checkExactButtonPress();
            return false;
        }

    }


    // Check if clicking on numberPad
    if (numberPadEventRunning)
    {
        let buttonClicked = numberPad.getButtonAtMouse();
        if (buttonClicked)
        {
            numberPad.pressed[buttonClicked] = true;
            lastButtonPressed = buttonClicked;
            //sounds.press.play();
            return false;
        }
    }
    
    // Check if clicking on valve
    if (valveMousePressed()) return false;
}