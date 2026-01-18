let DOX = SQUARE / 2;
let DOY = SQUARE / 2;

let deckTrap = {
    cards: [],
    revealed: [],
    running: false,
    locked: false
}

let deadCard = "";

let types = ["heart", "spade", "hourglass", "square", "circle", "plus", "snowflake", "fish"];
function loadCards()
{
    deadCard = loadImage("assets/images/cards/card0.png");
    deckTrap.cards = [];
    deckTrap.revealed = [];

    for (let i = 0; i <= types.length - 1; i++)
    {
        let img = loadImage("assets/images/cards/card" + (i + 1) + ".png");
        let cardType = types[i];
        for (let j = 0; j < 2; j++)
        {
            deckTrap.cards.push(new MemoryCard(cardType, img, 0, 0));
        }
    }
    lockCards();
}

function shuffleDeck()
{
    // Fisher-Yates shuffle
    for (let i = deckTrap.cards.length - 1; i > 0; i--)
    {
        let j = Math.floor(Math.random() * (i + 1));
        [deckTrap.cards[i], deckTrap.cards[j]] = [deckTrap.cards[j], deckTrap.cards[i]];
    }
    lockCards();
}

function lockCards()
{
    for (let i = -2; i < 2; i++)
    {
        for (let j = -2; j < 2; j++)
        {
            let index = (i + 2) * 4 + (j + 2);
            deckTrap.cards[index].x = i * 20;
            deckTrap.cards[index].y = j * 30;
        }
    }
}

function drawDeck()
{
    push();
    translate(DOX + 20, DOY + 40);
    noSmooth();
    stroke(0)
    strokeWeight(4);

    scale(3);
    for (let card of deckTrap.cards)
    {
        card.draw();
    }
    pop();
}

let deckEventTimeout = null;
let deckEventRunning = false;
let deckNumber = 0;
function scheduleDeckTrap()
{
    let delay = ranInt(ranInt(3000, 10000), ranInt(10000, 20000));
    deckEventTimeout = setTimeout(() => {
        if (!deckEventRunning)
        {
            for (let card of deckTrap.cards)
            {
                sounds.cardStart.volume = 0.6;
                sounds.cardStart.play();
                card.matched = false;
                card.faceUp = true;
            }
            shuffleDeck();
            deckStartEvent();
        }
    }, delay);
}

function deckStartEvent()
{
    deckEventRunning = true;
    traps.deck = true;
}

function deckEndEvent()
{
    deckEventRunning = false;
    traps.deck = false;
    loadCards();
    scheduleDeckTrap();
}

scheduleDeckTrap();

class MemoryCard
{
    constructor(name, type, x, y)
    {
        this.name = name;
        this.type = type;
        this.x = x;
        this.y = y;
        this.faceUp = false;
        this.matched = false;
    }

    draw()
    {
        imageMode(CENTER);
        if (this.faceUp)
            image(this.type, this.x, this.y);
        else
            image(deadCard, this.x, this.y);

    }
    containPoint(px, py)
    {
        // undo translate
        px -= (DOX + 20);
        py -= (DOY + 40);

        // undo scale
        px /= 3;
        py /= 3;
        return dist(px, py, this.x, this.y) < 10;
    }

    turn() { this.faceUp = false; }
}

function cardTrapClick()
{
    if (!deckEventRunning) return;
    if (deckTrap.locked) return;

    for (let card of deckTrap.cards)
    {
        if (
            card.containPoint(mouseX, mouseY) &&
            card.faceUp &&
            !card.matched
        )
        {
            sounds.cardGrab.play();
            revealCard(card);
            break;
        }
    }
}
function revealCard(card)
{
    if (deckTrap.revealed.length >= 2) return;

    card.faceUp = false;
    deckTrap.revealed.push(card);

    if (deckTrap.revealed.length === 2)
    {
        deckTrap.locked = true;
        setTimeout(checkPair, 200);
    }
}
function checkPair()
{
    let [a, b] = deckTrap.revealed;

    if (a.name === b.name)
    {
        // Correct match
        a.matched = true;
        b.matched = true;
        sounds.cardRight.play();
    }
    else
    {
        // Wrong match → flip back up
        a.faceUp = true;
        b.faceUp = true;
        sounds.cardWrong.play();
    }

    deckTrap.revealed = [];
    deckTrap.locked = false;

    checkDeckSolved();
}
function checkDeckSolved()
{
    if (deckTrap.cards.every(c => c.matched))
    {
        sounds.cardFinish.play();
        deckEndEvent();
    }
}