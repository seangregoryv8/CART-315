let VOX = WIDTH / 3 * 2 + (SQUARE / 2);
let VOY = SQUARE / 2;
let valveAngle = 0;
let isDraggingValve = false;

function drawValve()
{
    let enlarge = 20;
    
    // Calculate angle from valve center to mouse
    if (isDraggingValve) {
        let dx = mouseX - VOX;
        let dy = mouseY - VOY;
        valveAngle = atan2(dy, dx);
    }
    
    push();
    translate(VOX, VOY);
    rectMode(CENTER);
    rotate(valveAngle);
    noSmooth();
    fill(0);
    rect(0, 0, 10 * enlarge, 1 * enlarge, 20); // Debug valve position
    pop();
}

function checkValveHover() {
    let distance = dist(mouseX, mouseY, VOX, VOY);
    return distance < 150; // Valve hitbox radius
}

function valveMousePressed() {
    if (checkValveHover()) {
        isDraggingValve = true;
        return true;
    }
    return false;
}

function valveMouseReleased() {
    isDraggingValve = false;
}