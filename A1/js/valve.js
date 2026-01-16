let VOX = WIDTH / 3 * 2 + (SQUARE / 2);
let VOY = SQUARE / 2;
let valveAngle = 0;
let isDraggingValve = false;

const TWO_PI = Math.PI * 2;

let lastMouseAngle = 0;
let totalValveTurn = 0;

let valveRotationAmount = 0;

let particles = [];

function drawValve()
{
    let enlarge = 30;
    
    // Calculate angle from valve center to mouse
    if (isDraggingValve && valveEventRunning)
    {
        let dx = mouseX - VOX;
        let dy = mouseY - VOY;
        let currentAngle = atan2(dy, dx);

        let delta = currentAngle - lastMouseAngle;

        if (delta > Math.PI) delta -= TWO_PI;
        if (delta < -Math.PI) delta += TWO_PI;

        valveAngle += delta;
        totalValveTurn += abs(delta);

        lastMouseAngle = currentAngle;

        if (totalValveTurn >= TWO_PI * valveRotationAmount)
        { // 3 full turns
            valveEndEvent();
            isDraggingValve = false;
        }
    }
    
    // Valve
    push();
    translate(VOX - 75, VOY - 30);
    rectMode(CENTER);
    rotate(valveAngle + (-Math.PI / 2));
    noSmooth();
    stroke(0)
    strokeWeight(4);
    fill(255, 0, 0);
    rect(0, 0, 8 * enlarge, 1 * enlarge, 20);
    if (valveEventRunning) makeParticle(0, 0, 1, random(-1, 1), {r: 250, g: 250, b: 250, a: 100});
    pop();

    push();
    translate(VOX - 75, VOY - 30);
    for (let i = 0; i < particles.length; i++)
    {
        moveParticle(particles[i])
        if (particles[i].y <= -300)
            particles.splice(i, 1);
    }
    pop();

    if (valveEventRunning)
    {
        push();
        translate(VOX, VOY + 140);
        rectMode(CENTER);
        fill(0);
        rect(0, 0, 375, 50, 30)
        fill(255);
        textAlign(CENTER, CENTER);
        textFont(vhsFont);
        textSize(30);
        text("Rotate! (Drag Mouse)", 0, 0);
        pop();

        push();
        translate(VOX + 110, VOY - 100);
        rectMode(CENTER);
        fill(0);
        rect(0, 0, 150, 75, 30);
        fill(255);
        textAlign(CENTER, CENTER);
        textFont(vhsFont);
        textSize(20);
        text(Math.round(totalValveTurn) + " / " + Math.round(TWO_PI * valveRotationAmount), 0, 0);
        pop();
    }

}

function checkValveHover()
{
    let distance = dist(mouseX, mouseY, VOX, VOY);
    return distance < 150; // Valve hitbox radius
}

function valveMousePressed()
{
    if (checkValveHover())
    {
        isDraggingValve = true;
        totalValveTurn = 0;
        let dx = mouseX - VOX;
        let dy = mouseY - VOY;
        lastMouseAngle = atan(dy, dx);
        return true;
    }
    return false;
}

function valveMouseReleased() { isDraggingValve = false; }

/**
 * Moves those particles in a randomized order for flair.
 * @param {*} particle 
 */
function moveParticle(particle)
{
    fill(particle.shade.r, particle.shade.g, particle.shade.b)
    noStroke();
    rotate(0);
    ellipse(particle.x, particle.y, particle.size)
    particle.y -= (particle.velocityY / 10);
    particle.velocityY += random(0.2, 0.8);
    particle.x += particle.velocityX;
}

/**
 * Makes fancy particles for when the brick breaks for extra oomph
 * @param {*} x 
 * @param {*} y 
 * @param {*} velY 
 * @param {*} velX 
 * @param {*} color 
 */
function makeParticle(x, y, velY, velX, color)
{
    if (particles.length <= 2000)
    particles.push({
        x: x,
        y: y,
        velocityY: velY,
        velocityX: velX,
        size: random(5, 20),
        shade: color
    })
}

let valveEventTimeout = null;
let valveEventRunning = false;
function scheduleValveTrap()
{
    let delay = ranInt(5000, 15000);
    valveEventTimeout = setTimeout(() => {
        if (!valveEventRunning)
        {
            totalValveTurn = 0;
            valveRotationAmount = ranInt(5, 15);
            valveStartEvent();
        }
    }, delay);
}

function valveStartEvent()
{
    valveEventRunning = true;
    traps.valve = true;
}

function valveEndEvent()
{
    valveEventRunning = false;
    traps.valve = false;
    scheduleValveTrap();
}

scheduleValveTrap();