// Import stylesheets
import './style.css';

var canvas = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = 'none';
canvas.focus();

const INVADER_PER_ROW = 11;
const INVADER_FRAME_RATE = 15;
const MOVE_FRAME_RATE = 15;
const LASER_WIDTH = 3;
const LASER_LENGTH = 10;
const LASER_SPEED = 30; //smaller is faster
const COLOR_BACKGROUND = '#000';
const COLOR_SCORE = '#FFF';
const COLOR_LASER = '#49D11A';

class Invader {
  private x: number = 0;
  private y: number = 0;
  private row: number = 0;
  private frameCount: number = 0;
  private explodeImg: string =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAAAXNSR0IArs4c6QAAAG1JREFUOE+9VEEOABAMW///6InDhAlbI+NC6NqmBlRVRUQAoM82Tvszpq/D+hDghGmByDFrwONHLK9EJ6NL7rdMfTTZqP4LRE7Zc1j2VujblSXc+MoFWIcs/v8lZ78Iuk3LH1qZAEucjWbwVgs0LuGv+QWKNkEAAAAASUVORK5CYII=';

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw() {}

  animate(spritesheet: string, width: number, height: number) {
    let myImage = new Image();
    myImage.src = spritesheet;

    let column = 0;
    let maxRow = 1;
    this.frameCount++;
    if (this.frameCount > INVADER_FRAME_RATE) {
      this.row++;
      if (this.row > maxRow) {
        this.row = 0;
      }
      this.frameCount = 0;
    }
    ctx.drawImage(
      myImage,
      column * width,
      this.row * height,
      width,
      height,
      this.x,
      this.y,
      width,
      height
    );
  }

  update() {
    this.draw();
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  explode() {
    //this.frameCount++;
    //if (this.frameCount > INVADER_FRAME_RATE*3) {
    //ctx.clearRect(this.x, this.y, this.width, this.height);
    //  this.frameCount = 0
    //}
    /* let myImage = new Image();
    myImage.src = this.explodeImg;
    ctx.drawImage(myImage, this.x, this.y, this.width, this.height); */
  }
}

class Eclipse extends Invader {
  private spritesheet: string =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAALNJREFUSEvtlksOgDAIROX+h8a4KAsIfWKKTYwunWaGoXwqB3yqqrMjIiJT/DUBipQC8fhwZvbaBFYTByfbBHx1+EAIH04kc0AEhKNAtWqy86mDZQIZUTXnWUenbd4mkBFX/9sl+xRVichpuGSajnT5QZAiIELMABHQKCHH02VxiS8TICJy+u+Daobs/L5xTfOe8A/vg6cr1FLiXnqhk9sEaOg9xdOXHVXJXRxTRNOSnLULnAHa3+nzJVSiAAAAAElFTkSuQmCC';
  public width: number = 24;
  public height: number = 16;

  constructor(x: number, y: number) {
    super(x, y);
  }

  draw() {
    this.animate(this.spritesheet, this.width, this.height);
  }
}

class Crab extends Invader {
  private spritesheet: string =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAANlJREFUSEvNVlEOhTAIk/sfei+azCAW2qdu6qcbFAqU2QK+1lpbf5uZofP4r7oPHQwH6BEyIHa+sVBRwByw8xSgGyr8+zuoZmUNHgeIkfeIsoyyc5/JIYNhAFc5ZxSumWwZTAO4CxjtTxlMB7iqRX4ADzVAKbJC+hqmFGVO1LatMpW0qAegDFYM9h25VlTSR0oXTnaBASl2sIvuLhy5TZUWRfvgPYBTixExZNJC1VRxUKkxBfi3BoiBOfsgtuUTke/ygiZyGIA6YN99mzLtYdQhe/guUlelQtUPxEggMCpT5kcAAAAASUVORK5CYII=';
  private width: number = 24;
  private height: number = 16;

  constructor(x: number, y: number) {
    super(x, y);
  }

  draw() {
    this.animate(this.spritesheet, this.width, this.height);
  }
}

class Squid extends Invader {
  private spritesheet: string =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAJZJREFUSEvtlFEOwCAIQ+X+h2ZZMsxSbIryt2yfCo/SCTbI5+7+vjIzW4UuD+/AYwAmYlVUkhQcA1QiUzIVHAOYWeXzcuDzG1M8k45u07g2AN0NIFNQfgfbAKyszI0C6R3ERRnAKqsWZl4b8O+D0R/nMPGD+4C9j7Qbd3tPADRxe5jaALaBlAd0GlViUsxaUFMqN1IVcAFZXffxtHnYwAAAAABJRU5ErkJggg==';
  private width: number = 16;
  private height: number = 16;

  constructor(x: number, y: number) {
    super(x, y);
  }

  draw() {
    this.animate(this.spritesheet, this.width, this.height);
  }
}

class Invaders {
  public colony: Array<any> = [];
  private startingX = 50;
  private startingY = 200;
  private x: number = 50;
  private y: number = 200;
  private frameCount: number = 0;
  private direction: string = 'LEFT';
  private maxLength: number = 0;

  constructor() {
    this.draw();
    this.maxLength =
      this.colony[this.colony.length - 1][INVADER_PER_ROW - 1].x + 24;
  }

  draw() {
    let firstEclipseRow: Array<Eclipse> = [];
    for (let i = 0; i < INVADER_PER_ROW; i++) {
      firstEclipseRow.push(
        new Eclipse(this.startingX + 30 * i, this.startingY)
      );
    }
    this.colony.push(firstEclipseRow);

    let secondEclipseRow: Array<Eclipse> = [];
    for (let i = 0; i < INVADER_PER_ROW; i++) {
      secondEclipseRow.push(
        new Eclipse(this.startingX + 30 * i, this.startingY - 20)
      );
    }
    this.colony.push(secondEclipseRow);

    let thirdCrabRow: Array<Crab> = [];
    for (let i = 0; i < INVADER_PER_ROW; i++) {
      thirdCrabRow.push(new Crab(this.startingX + 30 * i, this.startingY - 20));
    }
    this.colony.push(thirdCrabRow);

    let fourthCrabRow: Array<Crab> = [];
    for (let i = 0; i < INVADER_PER_ROW; i++) {
      fourthCrabRow.push(
        new Crab(this.startingX + 30 * i, this.startingY - 20)
      );
    }
    this.colony.push(fourthCrabRow);

    let fithSquidRow: Array<Squid> = [];
    for (let i = 0; i < INVADER_PER_ROW; i++) {
      fithSquidRow.push(
        new Squid(this.startingX + 30 * i, this.startingY - 20)
      );
    }
    this.colony.push(fithSquidRow);
  }

  update() {
    this.move();
    for (let row = 0; row < this.colony.length; row++) {
      for (let individual = 0; individual < INVADER_PER_ROW; individual++) {
        if (this.colony[row][individual]) {
          this.colony[row][individual].update();
          this.colony[row][individual].move(
            this.x + 30 * individual,
            this.y - 30 * row
          );
        }
      }
    }
  }

  move() {
    this.frameCount++;
    if (this.frameCount > MOVE_FRAME_RATE) {
      if (this.direction == 'LEFT') {
        this.x -= 5;
      } else if (this.direction == 'RIGHT') {
        this.x += 5;
      }

      if (this.x == 0) {
        this.direction = 'RIGHT';
        this.y += 16;
      } else if (this.x + this.maxLength - this.startingX > canvas.width) {
        this.direction = 'LEFT';
        this.y += 16;
      }
      this.frameCount = 0;
    }
  }

  explode(_row: number, _position: number) {
    this.colony[_row][_position] = null;
  }
}

class Laser {
  public x: number = 0;
  public y: number = -LASER_LENGTH; //not visible
  private timerId: number;

  constructor() {}

  draw() {
    ctx.fillStyle = COLOR_LASER;
    ctx.fillRect(this.x, this.y, LASER_WIDTH, LASER_LENGTH);
  }

  update() {
    if (this.timerId && this.y < -LASER_LENGTH) {
      clearInterval(this.timerId);
    }
    this.draw();
  }

  fire(x: number, y: number) {
    if (this.isReady()) {
      this.x = x;
      this.y = y;
      this.timerId = setInterval(() => {
        this.y -= 5;
      }, LASER_SPEED);
    }
  }

  isReady() {
    return this.y <= 0;
  }

  hit() {
    this.x = 0;
    this.y = -LASER_LENGTH;
  }
}

class Cannon {
  private x: number;
  private y: number;
  public laser: Laser = new Laser();
  private cannonSize: number = 32;
  private cannon: string =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAG9JREFUWEdjZBhgwDjA9jOMOoDsEPC8KPUfOfq26z8jyyyyNIEsHnXAgIUAusXo2ZjUtEByGhh1wGgIjIYAzUOAkAWUVt/o5QRGOTBgDqC1xbhKTHgIDJgD6G0xekgwjjpgNARGQ2A0BEZDYKBDAAB9wlqFoTfm5AAAAABJRU5ErkJgggAA';

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.draw();
  }

  draw() {
    let myImage = new Image();
    myImage.src = this.cannon;
    ctx.drawImage(myImage, this.x, this.y, this.cannonSize, this.cannonSize);
  }

  update() {
    this.draw();
  }

  moveLeft() {
    this.x -= 10;
    this.draw();
  }

  moveRight() {
    this.x += 10;
    this.draw();
  }

  fire() {
    this.laser.fire(this.x + this.cannonSize / 2, this.y);
  }
}

class Score {
  private score: number = 0;

  constructor() {
    this.draw();
  }

  draw() {
    let leftPosition = canvas.width / 10;
    ctx.fillStyle = COLOR_SCORE;
    ctx.fillText(String(this.score), leftPosition, 50);
  }

  update() {
    this.draw();
  }

  increment() {
    this.score += 20;
  }
}

class InputController {
  private cannon: Cannon;

  constructor(cannon: Cannon) {
    this.cannon = cannon;

    document.addEventListener(
      'keydown',
      (evt) => {
        if (evt.key == 'ArrowLeft') {
          this.cannon.moveLeft();
        } else if (evt.key == 'ArrowRight') {
          this.cannon.moveRight();
        } else if (evt.key == ' ') {
          this.cannon.fire();
        }
      },
      false
    );
  }
}

class Game {
  private score: Score = new Score();
  private cannon: Cannon = new Cannon(canvas.width / 2, canvas.height - 50);
  private invaders: Invaders = new Invaders();

  constructor() {
    //Setup Components
    let inputController = new InputController(this.cannon);

    requestAnimationFrame(this.gameLoop);
  }

  // Setup Game Area
  setup() {
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '48px Verdana';
  }

  gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // use game object because of requewstAnimationFrame
    // calling function with this scope
    game.setup();
    game.checkCollision();
    game.cannon.update();
    game.cannon.laser.update();
    game.score.update();
    game.invaders.update();
    requestAnimationFrame(game.gameLoop);
  }

  checkCollision() {
    this.laserHitInvader(game.cannon.laser, game.invaders);
  }

  laserHitInvader(laser: Laser, invaders: Invaders) {
    for (let row = 0; row < invaders.colony.length; row++) {
      for (let entity = 0; entity < invaders.colony[row].length; entity++) {
        let invader = invaders.colony[row][entity];

        if (
          invader &&
          laser.x > 0 &&
          laser.x < canvas.height &&
          laser.x >= invader.x &&
          laser.x <= invader.x + invader.width &&
          laser.y >= invader.y &&
          laser.y <= invader.y + invader.height
        ) {
          invaders.explode(row, entity);
          laser.hit();
          game.score.increment();
        }
      }
    }
  }
}

let game = new Game();

/**
TODO:
- Explosions not working
- small invaders not centered
- Faster laser doesn't always hit the characters
- hitting spacebar causes laser to speed up and avoid using setInterval
- No Game over on contact with canon
- No refresh characters

Enhancements:
- faster when fewer
- shoot back
- protection areas that can be shot through and at
**/
