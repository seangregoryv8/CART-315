let EOX = WIDTH / 3 + (SQUARE / 2);
let EOY = SQUARE / 2;

let currentValue = 0;
let desiredValue = 0;

let exactButtons = {
    oneUp: false,
    oneDown: false,
    speedUp: false,
    speedDown: false,
    main: false
}

function drawExact()
{
    push();
    translate(EOX, EOY - 100);
    rectMode(CENTER);
    noSmooth();
    stroke(0)
    strokeWeight(4);
    fill(30);
    rect(-100, 0, 150, 80, 20);
    rect(100, 0, 150, 80, 20);

    if (exactEventRunning)
    {
        fill(255);
        textAlign(CENTER, CENTER);
        textFont(vhsFont);
        textSize(50);
        text(currentValue, -100, 0);
        fill(0, 255, 0);
        text(desiredValue, 100, 0);
    }
    pop();

    push();
    translate(EOX, EOY + 50);
    scale(2);
    imageMode(CENTER);
    noSmooth();
    
    exactButtons.main = dist(mouseX, mouseY, EOX, EOY + 50) < 40;
    image(exactButtons.main && isMousePressed ? exactTrapSprites.button.pressed : exactEventRunning ? exactTrapSprites.button.idle : exactTrapSprites.button.dead, 0, 0);

    exactButtons.oneUp = dist(mouseX, mouseY, EOX - 100, EOY) < 40;
    image(exactTrapSprites.buttons.oneUp, -50, -25);
    
    exactButtons.oneDown = dist(mouseX, mouseY, EOX + 100, EOY) < 40;
    image(exactTrapSprites.buttons.oneDown, 50, -25);

    exactButtons.speedUp = dist(mouseX, mouseY, EOX - 100, EOY + 100) < 40;
    image(exactTrapSprites.buttons.speedUp, -50, 25);

    exactButtons.speedDown = dist(mouseX, mouseY, EOX + 100, EOY + 100) < 40;
    image(exactTrapSprites.buttons.speedDown, 50, 25);
    pop();
}

let exactEventTimeout = null;
let exactEventRunning = false;
function scheduleExactTrap()
{
    let delay = ranInt(5000, 15000);
    exactEventTimeout = setTimeout(() => {
        if (!exactEventRunning)
        {
            desiredValue = ranInt(1, 99);
            sounds.circus.play();
            sounds.circus.setLoop(true);
            exactStartEvent();
        }
    }, delay);
}

function checkExactButtonPress()
{
    if (currentValue == desiredValue)
    {
        exactEndEvent();
        sounds.victory.play();
    }
    else sounds.cringe.play();
    currentValue = 0;
}

function exactStartEvent()
{
    exactEventRunning = true;
    traps.exact = true;
}

function exactEndEvent()
{
    sounds.circus.stop();
    exactEventRunning = false;
    traps.exact = false;
    scheduleExactTrap();
}

scheduleExactTrap();