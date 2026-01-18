"use strict";

let WIDTH = 1200;
let HEIGHT = 800;
let SQUARE = 400;

let startFlash = false;
let endFlash = false;
let flashRed = true;

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
    victory: "",
    crankDone: "",
    gameOver: []
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

function resetGame()
{
    // --- Core state ---
    startFlash = false;
    endFlash = false;
    flashRed = true;

    timerFinished = false;
    lastSecondPlayed = -1;
    startTimer = millis();

    recordTime = millis();

    // --- Traps ---
    for (let trap in traps)
        traps[trap] = false;

    isAnyTrapActive = false;

    // --- Colours ---
    let shuffled = [...colours];
    for (let i = shuffled.length - 1; i > 0; i--)
    {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    sideColours = shuffled.slice(0, 6);

    // --- Stop timers / events ---
    clearTimeout(numberPadEventTimeout);
    clearTimeout(exactEventTimeout);
    clearTimeout(valveEventTimeout);

    // --- Stop all sounds ---
    for (let key in sounds)
    {
        if (Array.isArray(sounds[key]))
            sounds[key].forEach(s => s.stop());
        else if (sounds[key]) sounds[key].stop();
    }

    for (let v in numberPad.voice)
        numberPad.voice[v].stop();

    // --- Reset input ---
    isMousePressed = false;
    isMouseOverButton = false;

    recordedTime = 0;

    exactEndEvent();
    numberPadEndEvent();
    valveEndEvent();
}

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

    sounds.circus = loadSound("assets/sounds/circus.mp3");
    sounds.cringe = loadSound("assets/sounds/cringe.mp3");
    sounds.up = loadSound("assets/sounds/up.wav");
    sounds.down = loadSound("assets/sounds/down.wav");
    sounds.victory = loadSound("assets/sounds/exactVictory2.mp3");
    sounds.crankDone = loadSound("assets/sounds/crankDone.mp3");
    
    sounds.gameOver.push(loadSound("assets/sounds/gameOver/1.wav"))
    sounds.gameOver.push(loadSound("assets/sounds/gameOver/2.wav"))
    sounds.gameOver.push(loadSound("assets/sounds/gameOver/3.wav"))
    sounds.gameOver.push(loadSound("assets/sounds/gameOver/4.wav"))
    sounds.gameOver.push(loadSound("assets/sounds/gameOver/5.wav"))
    sounds.gameOver.push(loadSound("assets/sounds/gameOver/6.wav"))
    sounds.gameOver.push(loadSound("assets/sounds/gameOver/7.wav"))
    sounds.gameOver.push(loadSound("assets/sounds/gameOver/8.wav"))
    sounds.gameOver.push(loadSound("assets/sounds/gameOver/9.wav"))
    sounds.gameOver.push(loadSound("assets/sounds/gameOver/10.wav"))
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
    recordTime = millis();
}

function draw()
{
    if (endFlash) 
        sideColours = ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000"];
    drawGrid();
    drawButtonPanel();
    if (!timerFinished) drawNumberPad();
    if (!timerFinished) drawValve();
    if (!timerFinished) drawExact();

    isAnyTrapActive = false;
    for (let trap in traps)
    {
        if (traps[trap] == true) isAnyTrapActive = true;
    }
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
    if (timeLeft === 0 && !timerFinished && !endFlash)
    {
        recordedTime = recordTime;
        timerFinished = true;
        if (sounds.explode)
        {
            setTimeout(() => {
                startFlash = true;
                sounds.explode.play();
                setTimeout(() => {
                    startFlash = false;
                    endFlash = true;
                }, 1200);
            }, 4000);
            setTimeout(() => sounds.gameOver[ranInt(0, 9)].play(), 2000);
        }
        clearTimeout(numberPadEventTimeout);
        clearTimeout(exactEventTimeout);
        clearTimeout(valveEventTimeout);

        sideColours = ["#222222", "#222222", "#222222", "#222222", "#222222", "#222222"]


        sounds.beep.stop();
        sounds.press.stop();
        sounds.explode.stop();
        sounds.steam.stop();
        sounds.turn.stop();
        sounds.circus.stop();
        sounds.cringe.stop();
        sounds.up.stop();
        sounds.down.stop();
        sounds.victory.stop();
        sounds.crankDone.stop();


        numberPad.voice.zero.stop(),
        numberPad.voice.one.stop(),
        numberPad.voice.two.stop(),
        numberPad.voice.three.stop(),
        numberPad.voice.four.stop(),
        numberPad.voice.five.stop(),
        numberPad.voice.six.stop(),
        numberPad.voice.seven.stop(),
        numberPad.voice.eight.stop(),
        numberPad.voice.nine.stop(),
        numberPad.voice.correct.stop(),
        numberPad.voice.on.stop(),
        numberPad.voice.incorrect.stop()
    }
    
    if (startFlash)
    {
        sideColours = [flashRed ? "#ff0000" : "#222222", flashRed ? "#ff0000" : "#222222", flashRed ? "#ff0000" : "#222222", flashRed ? "#ff0000" : "#222222", flashRed ? "#ff0000" : "#222222", flashRed ? "#ff0000" : "#222222"]
        flashRed = !flashRed;
    }
    // Reset timer finished flag when new game starts
    if (timeLeft > 0) timerFinished = false;
    
    push();
    translate(buttonCenterX, buttonCenterY)

    rectMode(CENTER);
    fill(0);
    if (!endFlash) rect(0, 125, 200, 100, 40);

    fill(255);
    textSize(80);
    textFont(vhsFont)
    textAlign(CENTER, CENTER);
    if (!endFlash) text(Math.ceil(timeLeft), 0, 125);

    scale(3);
    imageMode(CENTER);
    
    let distance = dist(mouseX, mouseY, buttonCenterX, buttonCenterY);
    isMouseOverButton = distance < (buttonSize / 4);
    
    noSmooth();
    if (!endFlash) image(isMouseOverButton && isMousePressed ? button.pressed : isAnyTrapActive ? button.dead : button.idle, 0, 0);
    
    fill(0);
    scale(1);
    if (!timerFinished) rect(0, -45, 120, 40, 20);
    fill(255);
    textSize(6);
    if (!timerFinished) text("Don't let the count reach 0\nPress the button to reset it\nComplete each game to unlock it", 0, -45);
    pop();

    if (endFlash)
    {
        push();
        translate(WIDTH / 2, HEIGHT / 2)
        textAlign(CENTER, CENTER);
        textSize(70);
        textFont(vhsFont)
        fill(255);
        text("GAME OVER\nTime elapsed: " + recordedTime + "s\nPress space to reset", 0, 0);
        pop();
    }
}

function drawGrid()
{
    push();
    stroke(0);
    if (!endFlash) strokeWeight(6);
    else noStroke();
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
    if (keyIsPressed && key == " " && endFlash)
        resetGame();
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
    if (!timerFinished)
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

}