let NPOX = WIDTH / 3 + (SQUARE / 2);
let NPOY = HEIGHT / 2 + (SQUARE / 2);
let lastButtonPressed = null;
let numberPad = {
    sprites: {
        idle: "",
        zero: "",
        one: "",
        two: "",
        three: "",
        four: "",
        five: "",
        six: "",
        seven: "",
        eight: "",
        nine: "",
        enter: "",
        dead: ""
    },
    pressed: {
        idle: false,
        zero: false,
        one: false,
        two: false,
        three: false,
        four: false,
        five: false,
        six: false,
        seven: false,
        eight: false,
        nine: false,
        enter: false
    },
    centre: {
        zero:  { x: NPOX - 30 , y: NPOY + 90  },
        one:   { x: NPOX - 90 , y: NPOY - 90  },
        two:   { x: NPOX - 30 , y: NPOY - 90  },
        three: { x: NPOX + 30 , y: NPOY - 90  },
        four:  { x: NPOX - 90 , y: NPOY - 30  },
        five:  { x: NPOX - 30 , y: NPOY - 30  },
        six:   { x: NPOX + 30 , y: NPOY - 30  },
        seven: { x: NPOX - 90 , y: NPOY + 30 },
        eight: { x: NPOX - 30 , y: NPOY + 30 },
        nine:  { x: NPOX + 30 , y: NPOY + 30 },
        enter: { x: NPOX + 90 , y: NPOY - 30 }
    },
    buttonSize: 80,
    getButtonAtMouse: function()
    {
        for (let key in this.centre)
        {
            let dist_val = dist(mouseX, mouseY, this.centre[key].x, this.centre[key].y);
            if (dist_val < this.buttonSize / 2)
            {
                if (key != "enter") numberPad.voice[key].play();
                return key;
            }
        }
        return null;
    },
    voice:
    {
        zero: null,
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        six: null,
        seven: null,
        eight: null,
        nine: null,
        correct: null,
        on: null,
        incorrect: null
    }
};

function drawNumberPad()
{
    push();
    translate(NPOX, NPOY)
    noSmooth();
    imageMode(CENTER);
    scale(3);
    
    let spriteToShow = numberPad.sprites.idle;

    if (!numberPadEventRunning) spriteToShow = numberPad.sprites.dead;
    else if (lastButtonPressed && numberPad.sprites[lastButtonPressed])
        spriteToShow = numberPad.sprites[lastButtonPressed];
    image(spriteToShow, 0, 0);

    if (numberPadEventRunning)
    {
        rectMode(CENTER);
        rect(0, -50, 100, 20);
        textAlign(CENTER, CENTER);
        textFont(vhsFont);
        fill(255, 0, 0);
        textSize(20);
        text(numberPadNumber, 0, -50)
    }


    pop();

    if (numberPadEventRunning) console.log(numberPadNumber)
}

function checkNumberPadSolution()
{
    if (numberPadEntry === numberPadNumber)
    {
        numberPad.voice.correct.play();
        console.log("Number pad solved!");
        numberPadEndEvent();
    }
    else numberPad.voice.incorrect.play();
    numberPadEntry = -1;
}

let numberPadEntry = -1;
function solveNumberPad(number)
{
    numberPadEntry = (numberPadEntry === -1) ? number : Number(String(numberPadEntry) + String(number));
}

let numberPadEventTimeout = null;
let numberPadEventRunning = false;
let numberPadNumber = 0;
function scheduleNumberPadTrap()
{
    return;
    let delay = ranInt(5000, 15000);
    numberPadEventTimeout = setTimeout(() => {
        if (!numberPadEventRunning)
        {
            numberPadNumber = ranInt(10000, 99999);
            numberPad.voice.on.play();
            numberPadStartEvent();
        }
    }, delay);
}

function numberPadStartEvent()
{
    numberPadEventRunning = true;
    traps.numberPad = true;
}

function numberPadEndEvent()
{
    numberPadEventRunning = false;
    traps.numberPad = false;
    scheduleNumberPadTrap();
}

scheduleNumberPadTrap();