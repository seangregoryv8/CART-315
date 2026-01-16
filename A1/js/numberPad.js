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
    getButtonAtMouse: function() {
        for (let key in this.centre)
        {
            let dist_val = dist(mouseX, mouseY, this.centre[key].x, this.centre[key].y);
            if (dist_val < this.buttonSize / 2) {
                return key;
            }
        }
        return null;
    },
};

function drawNumberPad()
{
    push();
    translate(NPOX, NPOY)
    noSmooth();
    imageMode(CENTER);
    scale(3);
    
    console.log(lastButtonPressed)
    // Display sprite based on last button pressed, or idle if none
    let spriteToShow = numberPad.sprites.idle;
    if (lastButtonPressed && numberPad.sprites[lastButtonPressed]) {
        spriteToShow = numberPad.sprites[lastButtonPressed];
    }
    image(spriteToShow, 0, 0);
    pop();
}