
let colours = [
    "#A3E635",
    "#2563EB",
    "#F97316",
    "#14B8A6",
    "#9333EA",
    "#EF4444",
    "#22C55E",
    "#EAB308",
    "#0EA5E9",
    "#DB2777",
    "#4B5563",
    "#84CC16",
    "#F43F5E",
    "#06B6D4",
    "#C026D3",
    "#FACC15",
    "#16A34A",
    "#1E40AF",
    "#FB7185",
    "#7C3AED"
];

function ranInt(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

let timerLength = 60;
let startTimer;
let timeLeft;