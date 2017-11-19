/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

document.addEventListener('DOMContentLoaded', () => {

    let canvas = document.querySelector('#canvas');
    let c = canvas.getContext('2d');
    let innerWidth = canvas.width = canvas.scrollWidth;
    let innerHeight = canvas.height = canvas.scrollHeight;

    // --- UTILITY FUNCTIONS ---

    let randomIntFromRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let getRandomColor = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    }
    // Function to detect collision
    let getDistance = (x1, y1, x2, y2) => {
        let xDistance = x2 - x1;
        let yDistance = y2 - y1;
        // Pythagorean Theorem
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    let shootSound = () => {
        soundEffect(
          1046.5,           //frequency
          0,                //attack
          0.3,              //decay
          "sawtooth",       //waveform
          0.1,                //Volume
          -0.8,             //pan
          0,                //wait before playing
          1200,             //pitch bend amount
          false,            //reverse bend
          0,                //random pitch range
          25,               //dissonance
          undefined, //echo array: [delay, feedback, filter]
          undefined         //reverb array: [duration, decay, reverse?]
        );
      }

      let smallExplosionSound = () => {
        soundEffect(
          16,          //frequency
          0,           //attack
          0.2,           //decay
          "sawtooth",  //waveform
          0.1,           //volume
          0,           //pan
          0,           //wait before playing
          0,           //pitch bend amount
          false,       //reverse
          0,           //random pitch range
          50,          //dissonance
          undefined,   //echo array: [delay, feedback, filter]
          undefined    //reverb array: [duration, decay, reverse?]
        );
      }

      let largeExplosionSound = () => {
        soundEffect(
          16,          //frequency
          0,           //attack
          1.2,           //decay
          "sawtooth",  //waveform
          0.1,           //volume
          0,           //pan
          0,           //wait before playing
          0,           //pitch bend amount
          false,       //reverse
          0,           //random pitch range
          50,          //dissonance
          undefined,   //echo array: [delay, feedback, filter]
          undefined    //reverb array: [duration, decay, reverse?]
        );
      }

    // --- EVENTS ---

    // -- Refresh on click --
    // canvas.addEventListener('click', function() {
    //     init();
    // });
    // -- Resize --
    // window.addEventListener('resize', function() {
    //     innerWidth = canvas.width = window.innerWidth;
    //     innerHeight = canvas.height = window.innerHeight - 50;
        
    //     init();
    // });

    // -- Spaceship Movement and shooting--

    let rightPressed = false;
    let leftPressed = false;
    let upPressed = false;
    let downPressed = false;
    
    let keyDownHandler = (e) => {
        if (e.keyCode === 39) {
            rightPressed = true;
        } else if (e.keyCode === 37) {
            leftPressed = true;
        } else if (e.keyCode === 38) {
            upPressed = true;
        } else if (e.keyCode === 40) {
            downPressed = true;
        }
    }
    
    let keyUpHandler = (e) => {
        if(e.keyCode === 39) {
            rightPressed = false;
        } else if (e.keyCode === 37) {
            leftPressed = false;
        } else if (e.keyCode === 38) {
            upPressed = false;
        } else if (e.keyCode === 40) {
            downPressed = false;
        }
    }

    let keyPressHandler = (e) => {
        if (e.key === 'x') {
            shootSound();
            let bullet = new Bullet(bulletProps);
            bullet.x = spaceship.layers[0].x;
            bullet.y = spaceship.layers[0].y;
            bullets.push(bullet);
        } 
    }

    let enemyShooting = () => {
        let timer = setInterval( () => {
            let bullet = new EnemyBullet(enemyBulletProps);
            bullet.x = enemyship.x + 40;
            enemyBullets.push(bullet);
        }, 1000);
    }
    enemyShooting();
    
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    document.addEventListener('keypress', keyPressHandler, false);

    // --- CONSTRUCTOR CLASSES---

    //  -- Base rectangle class --

    class Player {
        constructor(player) {
            this.x = player.x
            this.y = player.y
            this.font = player.font;
            this.text = player.text;
            this.color = player.color;
        }
        
        draw() {
            c.fillStyle = this.color;
            c.font = this.font;
            c.fillText(this.text, this.x, this.y);
        }
        update() {
            this.text = 'Score: ' + playerScore;
            this.draw();
        }
    }

    class Rectangle {
        constructor(rect) {
            this.x = rect.x;
            this.y = rect.y;
            this.width = rect.width;
            this.height = rect.height;
            this.color = rect.color;
        }
    }
    
    // -- Background Stars --
    class BackgroundStars extends Rectangle {
        constructor(stars) {
            super(stars);
            this.dy = stars.dy;
        }

        draw() {
            c.fillStyle = this.color;
            c.fillRect(this.x, this.y, this.width, this.height);
        };

        update() {

            // Restart cycle (inifinity)
            if (this.y > innerHeight) {
                this.y = randomIntFromRange(-100, -500);
            }
            // Larger raindrops are faster.
            if (this.width >= 3 && this.height >= 10) {
                this.dy = randomIntFromRange(11, 14); 
            }

            this.y += this.dy;
            this.draw();
        }
    }

    // -- Asteroids --
    class Asteroids extends Rectangle {
        constructor(asteroids) {
            super(asteroids);
            this.dy = asteroids.dy;
        }

        draw() {
            c.fillStyle = this.color;
            c.fillRect(this.x, this.y, this.width, this.height);
        };

        update() {

            // Restart cycle (inifinity)
            if (this.y > innerHeight) {
                this.y = randomIntFromRange(-100, -500);
            }
            // Larger asteroids are faster.
            if (this.width >= 50 && this.height >= 50) {
                this.dy = randomIntFromRange(2, 3); 
            }

            this.y += this.dy;
            this.draw();
        }
    }

    // -- Spaceship ---
    class Spaceship {
        constructor(ship) {
            this.layers = ship.layers; // Layers (array of objects) to draw more complicated shapes from numbers of rectangles.
        }

        draw() {
            for (let i = 0; i < this.layers.length; i++) {
                let data = this.layers[i];
                let loc = {
                    x: data.x,
                    y: data.y,
                    width: data.width,
                    height: data.height,
                    color: data.color
                };  
                c.fillStyle = loc.color;
                c.fillRect(loc.x, loc.y, loc.width, loc.height);
            }
        };

        update() {
            for (let i = 0; i < this.layers.length; i++) { // Applied controls to all spaceship layers.
                if (rightPressed && this.layers[15].x < innerWidth - this.layers[5].width) {
                    this.layers[i].x += 6; 
                } else if (leftPressed && this.layers[15].x > 0 + this.layers[4].width) {
                    this.layers[i].x -= 6;
                } else if (upPressed && this.layers[15].y > 0 + this.layers[15].height) {
                    this.layers[i].y -= 6;
                } else if (downPressed && this.layers[15].y < innerHeight - this.layers[15].height) {
                    this.layers[i].y += 6;
                } 
            }
            this.draw();
        }
    }

    // -- Bullet --
    class Bullet {
        constructor(bullet) {
            this.x = bullet.x;
            this.y = bullet.y;
            this.width = bullet.width;
            this.height = bullet.height; 
            this.color = bullet.color; 
        };

        draw() {
            c.fillStyle = this.color;
            c.fillRect(this.x, this.y, this.width, this.height);
        }
        
        update() {
            let dy = 10;
            this.y -= dy;
            this.draw();
        }
    }

    // -- Enemy ship --
    class EnemyShip {
        constructor(ship) {
            this.x = ship.x;
            this.dx = ship.dx;
            this.y = ship.y;
            this.width = ship.width;
            this.height = ship.height; 
            this.color = ship.color; 
        };

        draw() {
            c.fillStyle = this.color;
            c.fillRect(this.x, this.y, this.width, this.height);
        }

        update() {
            if (this.x + this.width > innerWidth || this.x < 0) {
                this.dx = -this.dx;
            }
            this.x += this.dx;            
            this.draw();
        }
    }

    // -- Bullet --
    class EnemyBullet {
        constructor(bullet) {
            this.x = bullet.x;
            this.dx = bullet.dx;
            this.y = bullet.y;
            this.width = bullet.width;
            this.height = bullet.height; 
            this.color = bullet.color; 
        };

        draw() {
            c.fillStyle = this.color;
            c.fillRect(this.x, this.y, this.width, this.height);
        }
        
        update() {
            let dy = 5;
            this.y += dy;
            this.draw();
        }
    }

    // --- DYNAMIC ELEMENTS TO RENDER ---

    let playerScore = 0;
    let player;
    
    let starsArray; // Array to store background stars.
    let spaceship;
    let p = 4; // Size of single pixel, used to create the ship.
    let bullet; 
    let bullets = []; // Array to store bullets.

    let asteroidsNumber = 0;  // Number of asteroids.
    let asteroidsArray; // Array to store asteroids.
    let asteroidsControlPoint = false; // Information about starting asteroids drop.
    let asteroidsDrop = 6000; // Asteroids drop time.

    let enemyship;
    let enemyBullets = [];

    let xStartingPoint = innerWidth/2 + p; // Starting X coordinate of spaceship and bullets.
    let yStartingPoint = innerHeight - 110 + p; // Starting Y coordinate of spaceship and bullets.
    // Bullet properties - declared outside init function bcs needed in keypress event.
    let bulletProps = {
        x: xStartingPoint.x, 
        y: yStartingPoint + p * 2, 
        width: p * 2, 
        height: p * 3,
        color: 'green'
    };
    
    let enemyXStartingPoint = innerWidth/2 + p; // Starting X coordinate of enemyship and bullets.
    let enemyYStartingPoint = 0; // Starting Y coordinate of enemyship and bullets.
    let enemyWidth = 80;
    let enemyHeight = 80;
    // Enemy bullet properties - declared outside init function bcs needed in enemyShooting interval function.
    let enemyBulletProps = {
        x: enemyXStartingPoint, 
        y: enemyYStartingPoint + enemyHeight, 
        width: p * 2, 
        height: p * 3,
        color: 'deeppink'
    };

    // Game state information div.
    let infoBox = document.getElementById('info');
    let shipDestroyed = document.getElementById('shipDestroyed');
    let earthDestroyed = document.getElementById('earthDestroyed');
    let shipShot = document.getElementById('shipShot');
    let timer = setTimeout( () => {
        infoBox.style.display = 'none';
    }, 7000);

    // --- FUNCTION TO INITIALIZE CANVAS ---

    let init = () => {
        // Player
        let playerProps = {
            x: innerWidth - 100,
            y: 0 + 40,
            font: '24px sh_pinscherregular',
            color: 'white'
        }
        player = new Player(playerProps);

        // Background stars.
        let dropsNumber = 40;
        starsArray = [];
        for (let i = 0; i < dropsNumber; i++) {
            let starProps = {
                x: randomIntFromRange(10, innerWidth - 10),
                y: randomIntFromRange(-100, -300),
                dy: randomIntFromRange(6, 10),
                width: randomIntFromRange(2, 3),
                height: randomIntFromRange(10, 14),
            };
            // Alternative stars size to create more stars in background.
            let alterStarProps = {
                x: randomIntFromRange(10, innerWidth - 10),
                y: randomIntFromRange(-100, -300),
                dy: randomIntFromRange(6, 10),
                width: randomIntFromRange(2, 4),
                height: randomIntFromRange(10, 14),
                widthBg: 2,
                heightBg: 10
            };
            let halfDropsNumber = dropsNumber / 2;
            // Creating more stars on the background (realistic effect).
            if (i < halfDropsNumber) {
                starProps.color = getRandomColor(['white', 'rgb(50, 50, 140)']);
                starsArray.push(new BackgroundStars(starProps));
            } else {
                starProps.color = getRandomColor(['white', 'rgb(50, 50, 140)']);
                starsArray.push(new BackgroundStars(alterStarProps));
            }
        }

        // Asteroids.
        asteroidsNumber = 10;
        asteroidsArray = [];
        let asteroidsLoop = () => {
            let timer = setInterval( () => {
                for (let i = 0; i < asteroidsNumber; i++) {
                    let asteroidsProps = {
                        x: randomIntFromRange(60, innerWidth - 60),
                        y: randomIntFromRange(-100, -300),
                        dy: randomIntFromRange(1, 2),
                        width: randomIntFromRange(40, 60),
                        height: randomIntFromRange(40, 60),
                        color: 'gray'
                    };       
                asteroidsControlPoint = true;
                asteroidsProps.x = randomIntFromRange(40, innerWidth - 60);
                asteroidsArray.push(new Asteroids(asteroidsProps));
            }
            }, asteroidsDrop);
        }
        asteroidsLoop();
        
        // Spaceship
        let shipProps = {
            layers: [
                {color: 'white', x: xStartingPoint, y: yStartingPoint, width: p * 2, height: p * 4},
                {color: 'white', x: xStartingPoint - p, y: yStartingPoint + p * 4, width: p * 4, height: p * 2},
                {color: 'white', x: xStartingPoint - p * 2, y: yStartingPoint + p * 6, width: p * 6, height: p * 2},
                {color: 'white', x: xStartingPoint - p * 3, y: yStartingPoint + p * 8, width: p * 8, height: p * 2},
                {color: 'white', x: xStartingPoint - p * 4, y: yStartingPoint + p * 10, width: p * 10, height: p * 2},
                {color: 'white', x: xStartingPoint - p * 5, y: yStartingPoint + p * 12, width: p * 12, height: p}, 
                {color: 'white', x: xStartingPoint - p * 6, y: yStartingPoint + p * 13, width: p * 14, height: p}, 
                {color: 'white', x: xStartingPoint - p * 7, y: yStartingPoint + p * 14, width: p * 16, height: p},
                {color: 'blue', x: xStartingPoint, y: yStartingPoint + p * 7, width: p * 2, height: p}, 
                {color: 'blue', x: xStartingPoint - p, y: yStartingPoint + p * 8, width: p * 4, height: p * 2}, 
                {color: 'blue', x: xStartingPoint - p * 2, y: yStartingPoint + p * 10, width: p * 6, height: p * 2}, 
                {color: 'red', x: xStartingPoint - p, y: yStartingPoint + p * 14, width: p * 4, height: p}, 
                {color: 'red', x: xStartingPoint - p, y: yStartingPoint + p * 15, width: p * 4, height: p}, 
                {color: 'orangered', x: xStartingPoint, y: yStartingPoint + p * 14, width: p * 2, height: p}, 
                {color: 'orangered', x: xStartingPoint, y: yStartingPoint + p * 15, width: p * 2, height: p}, 
                {color: 'red', x: xStartingPoint, y: yStartingPoint + p * 16, width: p * 2, height: p * 2}
            ]
        };
        // Function to create jet engine effect.
        let blinkEngine = () => {
            let color = '';
            let controler = false;
            let timer = setInterval( () => {
                if (controler ===  false) {
                    controler = true;
                    shipProps.layers[11].color = 'red';
                    shipProps.layers[12].color = 'red';
                    shipProps.layers[15].color = 'red';
                } else {
                    controler = false;
                    shipProps.layers[11].color = 'orangered';
                    shipProps.layers[12].color = 'orangered';
                    shipProps.layers[15].color = 'orangered';
                }
            }, 100);
        }
        spaceship = new Spaceship(shipProps); 
        blinkEngine(); 

        // Enemy ship
        let enemyProps = {
            x: enemyXStartingPoint,
            dx: 1,
            y: enemyYStartingPoint,
            width: enemyWidth,
            height: enemyHeight,
            color: 'red'
        }
        enemyship = new EnemyShip(enemyProps);
    }

    // --- MAIN ANIMATION LOOP ---
    
    (() => {
        let main = () => {
            let stopMain = window.requestAnimationFrame(main); // Variable to easy stop main loop.
            // Main loop content.
            c.clearRect(0, 0, innerWidth, innerHeight);
            let starsLength = starsArray.length;
            for (let i = 0; i < starsLength; i++) {
                starsArray[i].update();
            }

            spaceship.update();

            for (let i = 0; i < bullets.length; i++) {   
                bullets[i].update();
                // Removing bullet from array if it leaves the top edge of the canvas.
                if (bullets[i].y < 0) {
                    let bulletIndex = bullets.indexOf(bullets[i]);
                    bullets.splice(bulletIndex, 1);
                }
                for (var j = 0; j < asteroidsArray.length; j++) {
                    let asteroidXCenter = asteroidsArray[j].x + (asteroidsArray[j].width / 2); 
                    let asteroidYCenter = asteroidsArray[j].y - (asteroidsArray[j].height / 2);
                    // Collision effect between bullet and asteroid.
                    if (bullets[i] != undefined && getDistance(bullets[i].x, bullets[i].y, asteroidXCenter, asteroidYCenter) < 35) {
                        smallExplosionSound();
                        playerScore += 1;
                        let index = asteroidsArray.indexOf(asteroidsArray[j]);
                        let bulletIndex = bullets.indexOf(bullets[i]);
                        bullets.splice(bulletIndex, 1); // Collided bullet removed from array.
                        asteroidsArray.splice(index, 1); // Collided asteroid removed from array.
                    }
                }        
            }

            if (asteroidsControlPoint === true) {
                for (let i = 0; i < asteroidsArray.length; i++) {
                    asteroidsArray[i].update();
                    // Stopping game when asteroid leaves the bottom edge of the canvas
                    if (asteroidsArray[i] !== undefined && asteroidsArray[i].y > innerHeight){
                        largeExplosionSound();
                        earthDestroyed.style.display = 'block';
                        window.cancelAnimationFrame(stopMain);
                    }
                    let asteroidXCenter = asteroidsArray[i].x + (asteroidsArray[i].width / 2); 
                    let asteroidYCenter = asteroidsArray[i].y - (asteroidsArray[i].height / 2);
                    let shipXCenter = spaceship.layers[8].x + (spaceship.layers[8].width / 2); 
                    let shipYCenter = spaceship.layers[8].y - (spaceship.layers[8].height / 2); 
                    // Collision effect between ship and asteroid.  
                    if (getDistance(spaceship.layers[8].x, spaceship.layers[8].y, asteroidXCenter, asteroidYCenter) < 50) {
                        largeExplosionSound();
                        shipDestroyed.style.display = 'block';
                        window.cancelAnimationFrame(stopMain);
                    } 
                }
            }   

            enemyship.update();
            
            for (var i = 0; i < enemyBullets.length; i++) {
                enemyBullets[i].update();
                // Colission effect between enemy bullet and ship
                if (getDistance(spaceship.layers[8].x, spaceship.layers[8].y, enemyBullets[i].x, enemyBullets[i].y) < 20) {
                    largeExplosionSound();
                    shipShot.style.display = 'block';
                    window.cancelAnimationFrame(stopMain);
                }
                // Removing enemy bullet from array if it leaves the bottom edge of the canvas.
                if (enemyBullets[i].y > innerHeight) {
                    let bulletIndex = enemyBullets.indexOf(enemyBullets[i]);
                    enemyBullets.splice(bulletIndex, 1);
                } 
            }     
            player.update();
        }
        init(); // Initialize canvas with objects.
        main(); // Start the cycle.
    })();
})

/***/ })
/******/ ]);