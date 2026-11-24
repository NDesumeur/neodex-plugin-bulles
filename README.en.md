# Bulles (Bubbles)

A bubble shooter: aim, shoot towards the ceiling, and group the colours. Three matching bubbles that touch pop, and every bubble no longer attached to the ceiling falls. Clear the ceiling before it comes down to you.

*Version française : [README.md](README.md)*


## Adventure mode (new in 1.2.0)

Twelve handmade levels, each with a number of shots and a goal: clear the board, free the trapped fish (pop or drop their bubble) or drop the chest. Shots left at the end give points and up to three stars. Each level opens once the one before it is cleared.

Two new bubbles: the **ice bubble** thaws when a bubble lands against it, then plays like the others; the **magnet** pulls in shots that pass close by.

## Controls

- **Mouse**: aim; the dotted line shows the path, wall bounces included.
- **Click**: shoot.
- **← / →**: aim with the keyboard; **Space** or **↑**: shoot.
- **X**: swap the ready bubble with the next one (shown at the bottom left).
- **P**: pause.
- **Gamepad**: left stick or d-pad to aim, **A** to shoot, **X** or **Y** to swap, **Start** to pause.
- **Full screen**: the button next to New game. The aquarium takes the whole height of the window, small or large.

## Rules

- The shot bubble flies in a straight line, bounces off the walls, and sticks to the first bubble (or the ceiling) it touches, on a honeycomb grid.
- If it forms a group of **at least three bubbles of the same colour** touching each other, the group pops.
- Every bubble no longer connected to the ceiling, even indirectly, **falls**.
- **Every 7 shots**, the ceiling comes down one row; the countdown is shown at the top right.
- The game is lost when a bubble crosses the dotted line at the bottom: "It's full!".
- Bubbles to shoot only take colours still on the board.
- When no colour is left, the stones fall as a bonus and a new 6-row ceiling arrives with one more colour (from 4 at the start up to 6) and one more stone, and the ceiling goes back to the top.

## Special bubbles

- **Stone** (grey, cracked): it never breaks, even surrounded by matching bubbles. To get rid of it, make it fall by breaking what holds it.
- **Bomb**: every 20 shots, it comes as the next bubble. Where it sticks, it blows up everything within two bubbles, stones included.
- **Rainbow**: 10 shots after the bomb. It takes the colour of the neighbouring bubble that makes the biggest group.

The next bubble announces it in yellow ("bomb!", "rainbow!"); you can keep it for later with **X**.

## Points

- **10 points** per popped bubble.
- Each falling bubble is worth **20 points**, and more when the cluster is big (20 × (1 + number of fallen bubbles ÷ 4)): 4 fallen bubbles are worth 160 points, 8 are worth 480.
- When **several separate clusters fall at once**, it is a **combo**: the falling points are multiplied by the number of clusters ("COMBO ×2" shows up big).
- **15 points** per bubble blown away by a bomb.
- **500 bonus points** for clearing the board, and **50** per stone falling at that moment.

Each popped bubble swells, breaks into a ring then into drops; the points won rise from where the shot landed.

## Statistics

The Records panel shows your **best score**, the number of **games** and the total of **bubbles popped** (fallen ones included).

## Data and sync

Your best score and counters are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Bulles → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
