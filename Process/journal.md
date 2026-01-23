# Week 1 - January 22, 2026

![alt text](image-1.png)

## Make a Thing - KEEP PLAYING AND NOBODY EXPLODES

In this game, you have one simple goal: prevent the timer from reaching 0. If you do, the bomb explodes and it's game over.

However, there's one small caviat: there are multiple microgames on the bomb, ranging from valves that exhaust steam unless you close them to aligning cards, all of which prevents you from pressing the button to stop the detonation. You have to manage your resources and time, going through all the noise and struggle to concentrate and reset the timer by pressing the button, to keep playing so that nobody explodes.

## Process

### Day 1:
I knew I wanted to make some kind of management game as my first endeavor with a prototype, especially one with multiple little games so I could complete a few and see how they work. My central idea for this came from a game I hold dear to my heart: Keep Talking and Nobody Explodes, which I played religiously with a buddy of mine when we were both pre-teens. I sketched out a couple ideas for puzzles I knew I wanted to implement, including a number pad that would have a combination you'd have to answer to defuse it and a certain number you had to reach, only you could increment by +1 or +10 to achieve it. I knew what I wanted, but now became the goal of implementing it.

I quickly started by sketching out a grid of 400x400 squares where everything would be, with the button at the bottom right as a constant reminder. One big thing I wanted was custom sketch art, specifically of the bomb, to demonstrate its importance. The sketch was relatively easy as-is:

![Bomb sketch](../A1/assets/images/buttonHover.png)
![Bomb sketch](../A1/assets/images/buttonPressed.png)
![Bomb sketch](../A1/assets/images/buttonDead.png)

Now that that was done, it got late, so I decided to keep it for another day.

### Day 2

I used this as my primary code and first trap day. I coded in a simple countdown for the timer, and then coded a way for you to interact with the button to reset it, creating an infinite loop, exactly what I wanted.

Next, I set up systems that would prevent it from going off if any boolean in an object were false, which is where all my traps would go. With that set up, I started on my first trap: a numberpad Trap.

I got back on the pixel art editor and coded it in 3 parts: the buttons, the numbers, and the combination of the two being the padlock:

![](../A1/assets/images/numbers.png)
![](../A1/assets/images/pad.png)
![](../A1/assets/images/numberPad/np11.png)

I coded together each end-case, where each button would be pressed, since I believed that coding them individually would take longer. I got each sprite imported into the project, fitted it correctly using some simple math to divide the board into its individual cubes, and worked on the logic to click on them. Once the hitboxes were all fully finished, I quickly coded a "correct combination", a randomly-generated 5 digit code, and coded together the way to "solve" it by splitting it into its individual numbers and checking them off once each one was correct, with it resetting if you got it wrong and turning off if you got it right.

A pattern began to emerge for the event system, that being when the trap would commence, what would happen when it did, and how to disable it. I carried this over with me for all the rest of the traps.

Finally, to end the day, I started to draw out the rest of the pixel art, such as buttons for another microgame:

![](../A1/assets/images/buttons/btn1.png)
![](../A1/assets/images/buttonHover/btnHover0.png)

### Day 3

This is where I did 3 other traps to round things off. I knew I wanted one involving mouse movement, one involving mathematics, and another involving patterns, since I already did the one for memory.

#### Next traps
The first one I tackled was the mouse movement. From the start, I wanted some kind of valve to release steam, where you'd have to physically rotate the mouse a certain way to stop it.

#### Valve Trap
This involved tinkering. I first coded an easy rectangle for the valve and reused my particle system from another game, changing their values and rendering it as "steam". Afterwards, I reused previous code to activate and dispell the trap, matching it to the boolean object that prevents the button from being pressed.

#### Valve Rotation
Afterwards came the hardest part of the game: figuring out the rotations. Rotating the rectangle itself was fine, finding the central area and, after clicking, moving the rectangle to rotate along with wherever the mouse was. However, it was counting those rotations that became quite difficult. The current math I have going on would take a while to explain, mainly involving sin waves, constrains, atan2, and other portions, but once that was finished, it was able to detect a certain amount of rotations. All that was left was to code an "end" amount of rotations that triggered the endEvent, coding a "correct" rotation, whether clockwise or counterclockwise, and then finalizing it with some fun sound effects so the player would know where to go.

#### Exact Trap
The next one was very easy to do: the exact trap. I simply grabbed two rectangles, coded two numbers into them, that being your present value and the desired value, and coded each button to add or subtract 1 or 10 from the present value by reusing previous code for the buttons before. After that, it was only a matter of checking if the values matched whenever the buttons were pressed and stopping the trap when they did. Nothing too special here minus some funny sound effects.

#### Deck Trap
Finally, for the memory matching game, I crafted various cards with various distinct shapes onto them to make it easier at a glance:

![](../A1/assets/images/cards.png)

Afterwards, I then decided to be a bit special and code a custom class for a card, complete with its name, its value (sprite), whether it was face up or down, and whether it was solved. Go through each card in a for loop, spawn two of them, and then display them in a nested for loop in a 4x4 radius. Once that was done, it was a matter of "saving" what card was read, comparing it with another card chosen, flipping them both back up if you were wrong and keeping them both down when you were right. Once they were all down, the trap would disarm.

With that, I experimented and played with the game to test how fun it was, and it turned out to be a very nice experience overall with the game! The last day would be mostly polishing.

### Day 4
Today was mostly polishing details out.

#### Distinct sounds
I wanted each trap to have its own distinct sound, so the user would know what was active when. I got a realistic card shuffle sound for the deck trap, Microsoft SAM to voice out the numberPad trap, realistic steam noises for the valve trap (alongside its visuals), and a deeper Mortal Kombat "Test your Might" voice for the exact trap. After implementing different types of fun sounds for interactivity and immersion (a valve turning, retro sounds for picking cards, Microsoft SAM voicing each number you dialed, and pass/fail sounds for each), I knew what I wanted last was music. I decided to go with Carnival Night Zone Act 1 from Sonic 3 Prototype:

https://www.youtube.com/watch?v=Be3B-_ZrGu8

I figured it would be a nice touch.

#### Game Over

However, one thing my game lacked and desperately needed to be complete was a complete game loop, meaning a game over. I coded a flashing red sound for a "bomb explosion" and got the mine explosion sound from Minesweeper Plus by Jorel, as well as coding 10 different "game over" lines in Microsoft SAM that would be spoken, all combining together as the player "reacting" to losing, before the bomb explodes. I quickly coded together a "total elapsed time" to show how long they lasted, with spacebar then being coded to completely reset and restart the game, thus tying the gameplay loop together!

### Future plans

I already have a lot on my plate, so I doubt I'll be re-exploring this, but if I did, I would love to try getting "true randomness" on when the traps would arm, allowing for less of a "they all activate near all at once" and more of "you have to properly manage things". Additionally, I would add other traps, with each reload having them be at a random place, maybe 10 ish traps that would alternate so you would have 4-5 traps each. Finally, I would likely add a difficulty setting, that would allow for more tense gameplay being rewarded with more points or something.

To be honest, this was taking a lot of space in my head, and I really wanted to use this as an opportunity to get it out in terms of a "prototype". I'm quite proud with what I've done over the course of not even 4 days, and proud that I got to make some cool and custom sprite art, as well as experiment with a "Wario-Ware" kinda microgame mechanic, alongside me and my friends having fun playing it overall.

# Week 2 - January 29, 2026

![alt text](image.png)