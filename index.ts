// Import stylesheets
import './style.css';
/* -------------------------------------------------------------------------- */
/*                                MINI FRAMEWORK.                             */
/* -------------------------------------------------------------------------- */

// boiler plate setup the canvas for the game
var canvas = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = 'none';
canvas.focus();

// utility functions to use everywhere
class Util {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// Input Controller to use everywhere
class InputController {
  public x: number;
  public y: number;

  constructor() {}

  update(gameObject: GameObject) {}
}

class GameObject {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public command: string;

  private inputController: InputController;

  constructor(inputController?) {
    this.inputController = inputController;
  }

  update() {
    this.inputController?.update(this);
  }

  render() {}
}

class Group {
  public x: number;
  public y: number;
  public children: Array<GameObject>;

  constructor() {
    this.children = [];
  }

  update() {
    for (let gameObject of this.children) {
      if (gameObject) gameObject.update();
    }
  }

  render() {
    for (let gameObject of this.children) {
      if (gameObject) gameObject.render();
    }
  }
}

class Physics {
  private gameObjectCollisionRegister: Array<any> = [];
  private wallCollisionRegister: Array<any> = [];
  private objectA: GameObject;
  private objectB: GameObject;

  constructor() {}

  onCollide(
    objectA: GameObject,
    objectB: Group,
    callback: Function,
    scope: any
  ): void;
  onCollide(
    objectA: GameObject,
    objectB: GameObject,
    callback: Function,
    scope: any
  ): void;
  onCollide(
    objectA: GameObject,
    objectB: GameObject | Group,
    callback: Function,
    scope: any
  ): void {
    if (objectA && objectB) {
      if ('children' in objectB) {
        for (let gameObject of objectB.children) {
          this.gameObjectCollisionRegister.push({
            objectA: objectA,
            objectB: gameObject,
            callback: callback,
            scope: scope,
          });
        }
      } else {
        this.gameObjectCollisionRegister.push({
          objectA: objectA,
          objectB: objectB,
          callback: callback,
          scope: scope,
        });
      }
    }
  }

  onCollideWalls(objectA: GameObject, callback: Function, scope: any) {
    if (objectA) {
      this.wallCollisionRegister.push({
        objectA: objectA,
        callback: callback,
        scope: scope,
      });
    }
  }

  update() {
    for (let collisionEntry of this.gameObjectCollisionRegister) {
      if (
        collisionEntry.objectA.x > 0 &&
        collisionEntry.objectA.x < canvas.width &&
        collisionEntry.objectA.y > 0 &&
        collisionEntry.objectA.y < canvas.height &&
        collisionEntry.objectB.x > 0 &&
        collisionEntry.objectB.x < canvas.width &&
        collisionEntry.objectB.y > 0 &&
        collisionEntry.objectB.y < canvas.height &&
        collisionEntry.objectA.x >= collisionEntry.objectB.x &&
        collisionEntry.objectA.x <=
          collisionEntry.objectB.x + collisionEntry.objectB.width &&
        collisionEntry.objectA.y >= collisionEntry.objectB.y &&
        collisionEntry.objectA.y <=
          collisionEntry.objectB.y + collisionEntry.objectB.height
      ) {
        collisionEntry.callback.apply(collisionEntry.scope, [
          collisionEntry.objectA,
          collisionEntry.objectB,
        ]);
      }
    }
    for (let wallCollisionEntry of this.wallCollisionRegister) {
      if (
        wallCollisionEntry.objectA.y < wallCollisionEntry.objectA.height ||
        wallCollisionEntry.objectA.y > canvas.height ||
        wallCollisionEntry.objectA.x < wallCollisionEntry.objectA.width ||
        wallCollisionEntry.objectA.x > canvas.width
      ) {
        wallCollisionEntry.callback.bind(wallCollisionEntry.scope).apply();
      }
    }
  }
}

class Scene {
  public children: Array<GameObject>;
  public groups: Array<Group>;
  public physics: Physics;

  constructor() {
    this.children = [];
    this.groups = [];
    this.physics = new Physics();
  }

  add(object: Group): void;
  add(object: GameObject): void;
  add(object: GameObject | Group): void {
    if ('children' in object) {
      for (let gameObject of object.children) {
        this.children.push(gameObject);
      }
      this.groups.push(object);
    } else {
      this.children.push(object);
    }
  }

  create() {}

  update() {
    for (let gameObject of this.children) {
      if (gameObject) gameObject.update();
    }
    for (let group of this.groups) {
      if (group) group.update();
    }
    this.physics.update();
  }

  render() {
    // update the game background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let gameObject of this.children) {
      if (gameObject) gameObject.render();
    }
    for (let group of this.groups) {
      if (group) group.render();
    }
  }
}

class Game {
  private scene: Scene;
  private id: number;

  constructor(scene: Scene) {
    this.scene = scene;
    this.scene.create();
    //Setup Components
    this.id = requestAnimationFrame(this.gameLoop);
  }

  gameLoop(timestamp) {
    // WARNING: This pattern is not using Times Step and as such
    // Entities must be kept low, when needing multiple entities, scenes,
    // or other components it's recommended to move to a Game Framework

    // game lifecycle events
    game.scene.update();
    game.scene.render();

    // call next frame
    cancelAnimationFrame(game.id);
    game.id = requestAnimationFrame(game.gameLoop);
  }
}

/* -------------------------------------------------------------------------- */
/*                               GAME SPECIFIC CODE                           */
/* -------------------------------------------------------------------------- */

/* ------------------------------ GAME MECHANICS ---------------------------- */

const INVADER_PER_ROW = 11;
const INVADER_FRAME_RATE = 15;
const MOVE_FRAME_RATE = 15;
const LASER_WIDTH = 3;
const LASER_LENGTH = 10;
const LASER_SPEED = 30; //smaller is faster
const COLOR_BACKGROUND = '#000';
const COLOR_SCORE = '#FFF';
const COLOR_LASER = '#49D11A';

/* --------------------------------- ENTITIES ------------------------------- */

class Invader extends GameObject {
  private row: number = 0;
  private column: number;
  private frameCount: number = 0;
  private myImage: HTMLImageElement;

  private explodeImg: string =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAAAXNSR0IArs4c6QAAAG1JREFUOE+9VEEOABAMW///6InDhAlbI+NC6NqmBlRVRUQAoM82Tvszpq/D+hDghGmByDFrwONHLK9EJ6NL7rdMfTTZqP4LRE7Zc1j2VujblSXc+MoFWIcs/v8lZ78Iuk3LH1qZAEucjWbwVgs0LuGv+QWKNkEAAAAASUVORK5CYII=';

  constructor(
    x: number,
    y: number,
    spritesheet: string,
    width: number,
    height: number
  ) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.myImage = new Image();
    this.myImage.src = spritesheet;
  }

  update() {
    super.update();

    this.column = 0;
    let maxRow = 1;
    this.frameCount++;
    if (this.frameCount > INVADER_FRAME_RATE) {
      this.row++;
      if (this.row > maxRow) {
        this.row = 0;
      }
      this.frameCount = 0;
    }
  }

  render() {
    super.render();

    ctx.drawImage(
      this.myImage,
      this.column * this.width,
      this.row * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
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
  constructor(x: number, y: number) {
    let spritesheet: string =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAALNJREFUSEvtlksOgDAIROX+h8a4KAsIfWKKTYwunWaGoXwqB3yqqrMjIiJT/DUBipQC8fhwZvbaBFYTByfbBHx1+EAIH04kc0AEhKNAtWqy86mDZQIZUTXnWUenbd4mkBFX/9sl+xRVichpuGSajnT5QZAiIELMABHQKCHH02VxiS8TICJy+u+Daobs/L5xTfOe8A/vg6cr1FLiXnqhk9sEaOg9xdOXHVXJXRxTRNOSnLULnAHa3+nzJVSiAAAAAElFTkSuQmCC';
    let width: number = 24;
    let height: number = 16;
    super(x, y, spritesheet, width, height);
  }

  update() {
    super.update();
  }

  render() {
    super.render();
  }
}

class Crab extends Invader {
  constructor(x: number, y: number) {
    let spritesheet: string =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAANlJREFUSEvNVlEOhTAIk/sfei+azCAW2qdu6qcbFAqU2QK+1lpbf5uZofP4r7oPHQwH6BEyIHa+sVBRwByw8xSgGyr8+zuoZmUNHgeIkfeIsoyyc5/JIYNhAFc5ZxSumWwZTAO4CxjtTxlMB7iqRX4ADzVAKbJC+hqmFGVO1LatMpW0qAegDFYM9h25VlTSR0oXTnaBASl2sIvuLhy5TZUWRfvgPYBTixExZNJC1VRxUKkxBfi3BoiBOfsgtuUTke/ygiZyGIA6YN99mzLtYdQhe/guUlelQtUPxEggMCpT5kcAAAAASUVORK5CYII=';
    let width: number = 24;
    let height: number = 16;
    super(x, y, spritesheet, width, height);
  }

  update() {
    super.update();
  }

  render() {
    super.render();
  }
}

class Squid extends Invader {
  constructor(x: number, y: number) {
    let spritesheet: string =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAJZJREFUSEvtlFEOwCAIQ+X+h2ZZMsxSbIryt2yfCo/SCTbI5+7+vjIzW4UuD+/AYwAmYlVUkhQcA1QiUzIVHAOYWeXzcuDzG1M8k45u07g2AN0NIFNQfgfbAKyszI0C6R3ERRnAKqsWZl4b8O+D0R/nMPGD+4C9j7Qbd3tPADRxe5jaALaBlAd0GlViUsxaUFMqN1IVcAFZXffxtHnYwAAAAABJRU5ErkJggg==';
    let width: number = 16;
    let height: number = 16;
    super(x, y, spritesheet, width, height);
  }

  update() {
    super.update();
  }

  render() {
    super.render();
  }
}

class Invaders extends Group {
  private startingX = 50;
  private startingY = 200;
  private frameCount: number = 0;
  private direction: string = 'LEFT';
  private maxLength: number = 0;

  constructor() {
    super();
    this.x = this.startingX;
    this.y = this.startingY;

    for (let i = 0; i < INVADER_PER_ROW; i++) {
      this.children.push(new Eclipse(this.startingX + 30 * i, this.startingY));
    }

    for (let i = 0; i < INVADER_PER_ROW; i++) {
      this.children.push(
        new Eclipse(this.startingX + 30 * i, this.startingY - 20)
      );
    }

    for (let i = 0; i < INVADER_PER_ROW; i++) {
      this.children.push(
        new Crab(this.startingX + 30 * i, this.startingY - 40)
      );
    }

    for (let i = 0; i < INVADER_PER_ROW; i++) {
      this.children.push(
        new Crab(this.startingX + 30 * i, this.startingY - 60)
      );
    }

    for (let i = 0; i < INVADER_PER_ROW; i++) {
      this.children.push(
        new Squid(this.startingX + 30 * i, this.startingY - 80)
      );
    }

    this.maxLength = this.children[this.children.length - 1].x + 24;
  }

  update() {
    super.update();

    for (let individual = 0; individual < this.children.length; individual++) {
      if (this.children[individual]) {
        this.children[individual].x =
          this.x + 30 * Math.floor(individual % INVADER_PER_ROW);
        this.children[individual].y =
          this.y - 20 * Math.floor(individual / INVADER_PER_ROW);
      }
    }
  }

  render() {
    super.render();

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

  explode(_position: number) {
    this.children[_position].width = 0;
    this.children[_position].height = 0;
    this.children[_position] = null;
  }
}

class Laser extends GameObject {
  public x: number = 0;
  public y: number = -LASER_LENGTH; //not visible
  private timerId: number;

  constructor() {
    super();
    this.x = 0;
    this.y = -LASER_LENGTH;
    this.width = LASER_WIDTH;
    this.height = LASER_LENGTH;
  }

  update() {
    super.update();

    if (this.timerId && this.y < -LASER_LENGTH) {
      clearInterval(this.timerId);
    }
  }

  render() {
    super.render();

    ctx.fillStyle = COLOR_LASER;
    ctx.fillRect(this.x, this.y, LASER_WIDTH, LASER_LENGTH);
  }

  fire(x: number, y: number) {
    if (this.isReady()) {
      this.x = x;
      this.y = y;
      clearInterval(this.timerId);
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

class Cannon extends GameObject {
  public laser: Laser = new Laser();
  private cannonSize: number = 32;
  private cannon: string =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAG9JREFUWEdjZBhgwDjA9jOMOoDsEPC8KPUfOfq26z8jyyyyNIEsHnXAgIUAusXo2ZjUtEByGhh1wGgIjIYAzUOAkAWUVt/o5QRGOTBgDqC1xbhKTHgIDJgD6G0xekgwjjpgNARGQ2A0BEZDYKBDAAB9wlqFoTfm5AAAAABJRU5ErkJgggAA';

  constructor(x: number, y: number) {
    super(new CannonController());

    this.x = x;
    this.y = y;
    this.width = this.cannonSize;
    this.height = this.cannonSize;
  }

  update() {
    super.update();

    if (this.command == 'LEFT') {
      this.moveLeft();
    } else if (this.command == 'RIGHT') {
      this.moveRight();
    } else if (this.command == 'FIRE') {
      this.fire();
    }

    this.laser.update();
  }

  render() {
    super.render();

    this.laser.render();
    let myImage = new Image();
    myImage.src = this.cannon;
    ctx.drawImage(myImage, this.x, this.y, this.cannonSize, this.cannonSize);
  }

  moveLeft() {
    this.x -= 10;
  }

  moveRight() {
    this.x += 10;
  }

  fire() {
    this.laser.fire(this.x + this.cannonSize / 2, this.y);
  }
}

class Score extends GameObject {
  private score: number = 0;

  constructor() {
    super();
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    ctx.font = '48px Verdana';
    let leftPosition = canvas.width / 10;
    ctx.fillStyle = COLOR_SCORE;
    ctx.fillText(String(this.score), leftPosition, 50);
  }

  increment() {
    this.score += 20;
  }
}

/* ------------------------------- InputController  ----------------------------- */

class CannonController extends InputController {
  private command: string;

  constructor() {
    super();

    document.addEventListener(
      'keydown',
      (evt) => {
        if (evt.key == 'ArrowLeft') {
          this.command = 'LEFT';
        } else if (evt.key == 'ArrowRight') {
          this.command = 'RIGHT';
        } else if (evt.key == ' ') {
          this.command = 'FIRE';
        }
      },
      false
    );

    document.addEventListener(
      'keyup',
      (evt) => {
        this.command = null;
      },
      false
    );
  }

  update(gameObject: GameObject) {
    gameObject.command = this.command;
  }
}

/* --------------------------------- SCENE ------------------------------- */
class MainLevel extends Scene {
  private score: Score;
  private cannon: Cannon = new Cannon(canvas.width / 2, canvas.height - 50);
  private invaders: Invaders = new Invaders();

  constructor() {
    super();
  }

  create() {
    this.score = new Score();
    this.add(this.score);

    this.cannon = new Cannon(canvas.width / 2, canvas.height - 50);
    this.add(this.cannon);

    this.invaders = new Invaders();
    this.add(this.invaders);

    this.physics.onCollide(
      this.cannon.laser,
      this.invaders,
      this.onLaserHitInvaders,
      this
    );
  }

  update() {
    super.update();
  }

  render() {
    super.render();
  }

  onLaserHitInvaders(laser: GameObject, invader: GameObject) {
    for (let index in this.invaders.children) {
      if (
        this.invaders.children[index] &&
        this.invaders.children[index].x == invader.x &&
        this.invaders.children[index].y == invader.y
      ) {
        this.invaders.explode(+index);
      }
    }

    this.cannon.laser.hit();
    this.score.increment();
  }
}

/* -------------------------------------------------------------------------- */
/*                                RUN GAME.                                   */
/* -------------------------------------------------------------------------- */
let mainLevel = new MainLevel();
let game = new Game(mainLevel);

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
