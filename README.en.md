# Bulles (Bubbles)

A bubble shooter: aim, shoot towards the ceiling, and group the colours. Three matching bubbles that touch pop, and every bubble no longer attached to the ceiling falls. Clear the ceiling before it comes down to you.

*Version française : [README.md](README.md)*

## Controls

- **Mouse**: aim; the dotted line shows the path, wall bounces included.
- **Click**: shoot.
- **← / →**: aim with the keyboard; **Space** or **↑**: shoot.
- **X**: swap the ready bubble with the next one (shown at the bottom left).
- **P**: pause.

## Rules

- The shot bubble flies in a straight line, bounces off the walls, and sticks to the first bubble (or the ceiling) it touches, on a honeycomb grid.
- If it forms a group of **at least three bubbles of the same colour** touching each other, the group pops.
- Every bubble no longer connected to the ceiling, even indirectly, **falls**.
- **Every 7 shots**, the ceiling comes down one row; the countdown is shown at the top right.
- The game is lost when a bubble crosses the dotted line at the bottom: "It's full!".
- Bubbles to shoot only take colours still on the board.
- When the board is empty, a new 6-row ceiling arrives with one more colour (from 4 at the start up to 6), and the ceiling goes back to the top.

## Points

- **10 points** per popped bubble.
- Each falling bubble is worth **20 points**, and more when the cluster is big (20 × (1 + number of fallen bubbles ÷ 4)): 4 fallen bubbles are worth 160 points, 8 are worth 480.
- **500 bonus points** for clearing the board.

## Statistics

The Records panel shows your **best score**, the number of **games** and the total of **bubbles popped** (fallen ones included).

## Data and sync

Your best score and counters are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Bulles → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
