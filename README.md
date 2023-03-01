# Space Invaders Game

This is a simple 2D game called Space Invaders.

## How to Play

The code provided appears to be a simple implementation of a space-invaders-style game. To play the game, you need to open the HTML file in a web browser, which should display a canvas element where the game will be rendered. The objective of the game is to destroy all the enemy invaders that are moving back and forth across the screen. You control a spaceship at the bottom of the screen, which can be moved left or right using the arrow keys on your keyboard. You can fire lasers at the invaders by pressing the space bar. If you hit an invader, it will explode and disappear from the screen, and you will earn points. If you let an invader reach the bottom of the screen, you lose a life. The game is over when you have lost all your lives, or when you have destroyed all the invaders.

## Code Structure

- `Invader`: This is the base class for all of the alien types in the game. It contains methods for drawing and animating the aliens, as well as updating their position on the screen.
- `Eclipse`: This is a subclass of the Invader class, and represents one of the alien types in the game. It has a unique spritesheet and movement pattern.
- `Crab`: This is another subclass of the Invader class, and represents another type of alien in the game. It also has a unique spritesheet and movement pattern.
- `Squid`: This is another subclass of the Invader class, and represents another type of alien in the game. It also has a unique spritesheet and movement pattern.
- `Player`: This class represents the player's spaceship. It contains methods for updating the position of the ship, as well as firing lasers.
- `Laser`: This class represents the lasers fired by the player and the aliens. It contains methods for updating the position of the laser and detecting collisions with other objects on the screen.

## Game Settings

- INVADER_PER_ROW: the number of invaders per row.
- INVADER_FRAME_RATE: the frame rate at which the invader sprites will animate.
- MOVE_FRAME_RATE: the frame rate at which the invader block will move across the screen.
- LASER_WIDTH: the width of the player's laser beam.
- LASER_LENGTH: the length of the player's laser beam.
- LASER_SPEED: the speed at which the player's laser beam travels.
- COLOR_BACKGROUND: the background color of the game's canvas.
- COLOR_SCORE: the color of the score display.
- COLOR_LASER: the color of the player's laser beam.

## Game overview

### Game objective

The objective of the game is to shoot down as many aliens as possible before they reach the bottom of the screen. The player controls a spaceship at the bottom of the screen and can move it left and right to avoid incoming alien attacks.

## Gameplay

### Controls

- Arrow keys: move the cannon left or right
- Space bar: shoot the cannon laser

## Game Mechanics

The game is built with HTML, CSS, and JavaScript. It uses the HTML canvas element to draw the graphics and create animations.

The game features several types of aliens, each with their own unique spritesheet and movement pattern. The aliens move back and forth across the screen in formation, and will occasionally stop and shoot lasers at the player's ship. The player can shoot lasers at the aliens by pressing the spacebar, and can move their ship left and right using the left and right arrow keys.

The game also features a score system, which increments each time an alien is hit. The score is displayed at the top of the screen, along with the player's remaining lives.

### Game entities:

- Invaders (Eclipse, Squid and Crab)
- Laser

### Technical details:

- The game canvas is retrieved and its context is set to 2D.
- The canvas is given a tabindex of 1 to allow it to receive keyboard focus.
- The outline of the canvas is removed.
- The canvas is focused to ensure that keyboard events are captured.
