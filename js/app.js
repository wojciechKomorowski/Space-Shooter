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
    class Invader {
        constructor(object) {
            this.layers = object.layers; // Layers (array of objects) to draw more complicated shapes from numbers of rectangles.
            this.dy = object.dy;
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
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].y += this.dy;
            }
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
        constructor(object) {
            this.layers = object.layers; // Layers (array of objects) to draw more complicated shapes from numbers of rectangles.
            this.dx = object.dx;
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
            for (let i = 0; i < this.layers.length; i++) {
                if (this.layers[i].x + this.layers[i].width > innerWidth || this.layers[i].x < 0) {
                    this.dx = -this.dx;
                }
                this.layers[i].x += this.dx; 
            }         
            this.draw();
        }
    }

    // -- Bullet --
    class EnemyBullet {
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
            let dy = 5;
            this.y += dy;
            this.draw();
        }
    }

    // -- Enemy ship --
    class Star {
        constructor(object) {
            this.layers = object.layers; // Layers (array of objects) to draw more complicated shapes from numbers of rectangles.
            this.dy = object.dy;
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
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].y += this.dy; 
            }         
            this.draw();
        }
    }

    // --- DYNAMIC ELEMENTS TO RENDER ---

    let playerScore = 0;
    let player;
    
    let starsArray; // Array to store background stars.
    let spaceship;
    let p = 4; // Size of single pixel, used to create the ship..
    let ep = 5; // Size of single pixel, used to create the enemyeship.
    let ip = 4; // Size of single pixel, used to create the invader.
    let sp = 4; // Size of single pixel, used to create the star.
    let bullet; 
    let bullets = []; // Array to store bullets.

    let invaders = []; // Array to store invaders.
    let invadersDropTime = 6000; // Asteroids drop time.
    let invadersControlPoint = false;
    
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
        color: 'orange'
    };
    
    let enemyXStartingPoint = innerWidth/2; // Starting X coordinate of enemyship and bullets.
    let enemyYStartingPoint = ep * 6; // Starting Y coordinate of enemyship and bullets.

    let stars = [];
    let starsDropTime = 6000; // Asteroids drop time.
    let starsControlPoint = false;

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

        // Invaders
        
        let invadersDrop = () => {
            let timer = setInterval( () => {
                invadersControlPoint = true;
                for (let i = 0; i < 10; i++) {
                    let invaderXStartingPoint = randomIntFromRange(30, innerWidth - 50); // Starting X coordinate of invaders.
                    let invaderYStartingPoint = randomIntFromRange(-100, -400); // Starting Y coordinate of invaders.
                    let invaderProps = {
                        layers: [
                            {color: 'lime', x: invaderXStartingPoint, y: invaderYStartingPoint, width: ip, height: ip},
                            {color: 'lime', x: invaderXStartingPoint + ip * 3, y: invaderYStartingPoint, width: ip, height: ip},
                            {color: 'lime', x: invaderXStartingPoint - ip, y: invaderYStartingPoint + ip, width: ip * 6, height: ip},
                            {color: 'lime', x: invaderXStartingPoint - ip * 2, y: invaderYStartingPoint + ip * 2, width: ip * 8, height: ip},
                            {color: 'lime', x: invaderXStartingPoint - ip * 3, y: invaderYStartingPoint + ip * 3, width: ip * 10, height: ip},
                            {color: 'lime', x: invaderXStartingPoint - ip * 3, y: invaderYStartingPoint + ip * 4, width: ip * 10, height: ip},
                            {color: 'lime', x: invaderXStartingPoint - ip * 3, y: invaderYStartingPoint + ip * 5, width: ip * 10, height: ip},
                            {color: 'lime', x: invaderXStartingPoint - ip * 3, y: invaderYStartingPoint + ip * 6, width: ip * 10, height: ip},
                            {color: 'black', x: invaderXStartingPoint - ip, y: invaderYStartingPoint + ip * 3, width: ip * 2, height: ip},
                            {color: 'black', x: invaderXStartingPoint + ip * 3, y: invaderYStartingPoint + ip * 3, width: ip * 2, height: ip},
                            {color: 'black', x: invaderXStartingPoint - ip, y: invaderYStartingPoint + ip * 6, width: ip, height: ip},
                            {color: 'black', x: invaderXStartingPoint + ip, y: invaderYStartingPoint + ip * 6, width: ip, height: ip},
                            {color: 'black', x: invaderXStartingPoint + ip * 2, y: invaderYStartingPoint + ip * 6, width: ip, height: ip},
                            {color: 'black', x: invaderXStartingPoint + ip * 4, y: invaderYStartingPoint + ip * 6, width: ip, height: ip}
                        ],
                        dy: randomIntFromRange(2, 3)
                    }; 
                    let invader = new Invader(invaderProps);
                    invaders.push(invader);
                }
            }, invadersDropTime)
        }
        invadersDrop();

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
            layers: [
                {color: 'blue', x: enemyXStartingPoint, y: enemyYStartingPoint, width: ep * 4, height: ep},
                {color: 'blue', x: enemyXStartingPoint - ep * 4, y: enemyYStartingPoint + ep, width: ep * 12, height: ep},
                {color: 'blue', x: enemyXStartingPoint - ep * 5, y: enemyYStartingPoint + ep * 2, width: ep * 14, height: ep},
                {color: 'blue', x: enemyXStartingPoint - ep * 6, y: enemyYStartingPoint + ep * 3, width: ep * 16, height: ep},
                {color: 'blue', x: enemyXStartingPoint - ep * 6, y: enemyYStartingPoint + ep * 4, width:ep * 16, height: ep},
                {color: 'lightgray', x: enemyXStartingPoint - ep * 8, y: enemyYStartingPoint + ep * 5, width: ep * 20, height: ep},
                {color: 'darkgray', x: enemyXStartingPoint - ep * 9, y: enemyYStartingPoint + ep * 6, width: ep * 22, height: ep},
                {color: 'gray', x: enemyXStartingPoint - ep * 10, y: enemyYStartingPoint + ep * 7, width: ep * 24, height: ep},
                {color: 'darkgray', x: enemyXStartingPoint - ep * 9, y: enemyYStartingPoint + ep * 8, width: ep * 22, height: ep},
                {color: 'lightgray', x: enemyXStartingPoint - ep * 8, y: enemyYStartingPoint + ep * 9, width: ep * 20, height: ep},
                {color: 'gray', x: enemyXStartingPoint - ep * 6, y: enemyYStartingPoint + ep * 10, width: ep * 16, height: ep},
                {color: 'lightblue', x: enemyXStartingPoint + ep * 3, y: enemyYStartingPoint + ep, width: ep * 3, height: ep},
                {color: 'lightblue', x: enemyXStartingPoint + ep * 4, y: enemyYStartingPoint + ep * 2, width: ep * 3,height: ep},
                {color: 'lightblue', x: enemyXStartingPoint + ep * 5, y: enemyYStartingPoint + ep * 3, width: ep * 2,height: ep},
                {color: 'cyan', x: enemyXStartingPoint - ep * 7, y: enemyYStartingPoint + ep * 7, width: ep, height: ep},
                {color: 'cyan', x: enemyXStartingPoint + ep * 10, y: enemyYStartingPoint + ep * 7, width: ep, height: ep},
                {color: 'cyan', x: enemyXStartingPoint - ep, y: enemyYStartingPoint +ep * 7, width: ep, height: ep},
                {color: 'cyan', x: enemyXStartingPoint + ep * 4, y: enemyYStartingPoint + ep * 7, width: ep, height: ep},
                {color: 'cyan', x: enemyXStartingPoint - ep * 4, y: enemyYStartingPoint + ep * 12, width: ep * 12, height: ep},
                {color: 'cyan', x: enemyXStartingPoint - ep * 2, y: enemyYStartingPoint + ep * 14, width: ep * 8, height: ep},
            ],
            dx: 1
        }
        // Function to create jet engine effect.
        let blinkLights = () => {
            let color = '';
            let controler = false;
            let timer = setInterval( () => {
                if (controler ===  false) {
                    controler = true;
                    enemyProps.layers[14].color = 'yellow';
                    enemyProps.layers[15].color = 'yellow';
                    enemyProps.layers[16].color = 'yellow';
                    enemyProps.layers[17].color = 'yellow';
                } else {
                    controler = false;
                    enemyProps.layers[14].color = 'cyan';
                    enemyProps.layers[15].color = 'cyan';
                    enemyProps.layers[16].color = 'cyan';
                    enemyProps.layers[17].color = 'cyan';
                }
            }, 500);
        }
        blinkLights();
        enemyship = new EnemyShip(enemyProps);

        // Enemy bullets
        let enemyShooting = () => {
            let enemyBulletProps = {
                x: enemyXStartingPoint, 
                y: enemyYStartingPoint, 
                width: p * 2, 
                height: p * 3,
                color: 'cyan'
            };
            let timer = setInterval( () => {
                let bullet = new EnemyBullet(enemyBulletProps);
                bullet.x = enemyship.layers[19].x + p * 2;
                bullet.y = enemyship.layers[19].y + p * 2;
                enemyBullets.push(bullet);
            }, 1000);
        }
        enemyShooting();  

        // Star
        let starDrop = () => {
            let timer = setInterval( () => {
                starsControlPoint = true;
                for (let i = 0; i < 1; i++) {
                    starXStartingPoint = randomIntFromRange(30, innerWidth - 30); // Starting X coordinate of star.
                    starYStartingPoint = randomIntFromRange(-100, -400) // Starting Y coordinate of star.
                    let starProps = {
                        layers: [
                            {color: 'yellow', x: starXStartingPoint, y: starYStartingPoint, width: sp * 2, height: sp},
                            {color: 'yellow', x: starXStartingPoint, y: starYStartingPoint + sp, width: sp * 2, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp, y: starYStartingPoint + sp * 2, width: sp * 4, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp, y: starYStartingPoint + sp * 3, width: sp * 4, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 2, y: starYStartingPoint + sp * 4, width: sp * 6, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 6, y: starYStartingPoint + sp * 5, width: sp * 14, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 5, y: starYStartingPoint + sp * 6, width: sp * 12, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 4, y: starYStartingPoint + sp * 7, width: sp * 10, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 3, y: starYStartingPoint + sp * 8, width: sp * 8, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 2, y: starYStartingPoint + sp * 9, width: sp * 6, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 2, y: starYStartingPoint + sp * 10, width: sp * 6, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 3, y: starYStartingPoint + sp * 11, width: sp * 8, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 3, y: starYStartingPoint + sp * 12, width: sp * 8, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 3, y: starYStartingPoint + sp * 13, width: sp * 2, height: sp},
                            {color: 'yellow', x: starXStartingPoint + sp * 3, y: starYStartingPoint + sp * 13, width: sp * 2, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 4, y: starYStartingPoint + sp * 14, width: sp * 2, height: sp},
                            {color: 'yellow', x: starXStartingPoint + sp * 4, y: starYStartingPoint + sp * 14, width: sp * 2, height: sp},
                            {color: 'yellow', x: starXStartingPoint - sp * 4, y: starYStartingPoint + sp * 15, width: sp * 2, height: sp},
                            {color: 'yellow', x: starXStartingPoint + sp * 4, y: starYStartingPoint + sp * 15, width: sp * 2, height: sp},
                            {color: 'black', x: starXStartingPoint - sp, y: starYStartingPoint + sp * 6, width: sp, height: sp * 2},
                            {color: 'black', x: starXStartingPoint + sp * 2, y: starYStartingPoint + sp * 6, width: sp, height: sp * 2},
                            {color: 'black', x: starXStartingPoint - sp / 2, y: starYStartingPoint + sp * 10, width: sp * 3, height: sp},
                            {color: 'black', x: starXStartingPoint - sp, y: starYStartingPoint + sp * 9, width: sp, height: sp},
                            {color: 'black', x: starXStartingPoint + sp * 2, y: starYStartingPoint + sp * 9, width: sp, height: sp},
                        ],
                        dy: randomIntFromRange(2, 3)
                    }; 
                    let star = new Star(starProps);
                    stars.push(star);
                }
                console.log(stars);
                
            }, starsDropTime)
        }
        // starDrop();
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
                for (var j = 0; j < invaders.length; j++) {
                    let invaderXCenter = invaders[j].layers[5].x + (invaders[j].layers[5].width / 2); 
                    let invaderYCenter = invaders[j].layers[5].y - (invaders[j].layers[5].height / 2);
                    // Collision effect between bullet and invader.
                    if (bullets[i] != undefined && getDistance(bullets[i].x, bullets[i].y, invaderXCenter, invaderYCenter) < 20) {
                        smallExplosionSound();
                        playerScore += 1;
                        let index = invaders.indexOf(invaders[j]);
                        let bulletIndex = bullets.indexOf(bullets[i]);
                        bullets.splice(bulletIndex, 1); // Collided bullet removed from array.
                        invaders.splice(index, 1); // Collided invader removed from array.
                    }
                }        
            }

            if (invadersControlPoint === true) {
                for (let i = 0; i < invaders.length; i++) {
                    invaders[i].update();
                    // Stopping game when invader leaves the bottom edge of the canvas
                    if (invaders[i] !== undefined && invaders[i].layers[5].y > innerHeight){
                        largeExplosionSound();
                        earthDestroyed.style.display = 'block';
                        window.cancelAnimationFrame(stopMain);
                    }
                    let invaderXCenter = invaders[i].layers[5].x + (invaders[i].layers[5].width / 2); 
                    let invaderYCenter = invaders[i].layers[5].y - (invaders[i].layers[5].height / 2);
                    let shipXCenter = spaceship.layers[8].x + (spaceship.layers[8].width / 2); 
                    let shipYCenter = spaceship.layers[8].y - (spaceship.layers[8].height / 2); 
                    // Collision effect between ship and invader.  
                    if (getDistance(shipXCenter, shipYCenter, invaderXCenter, invaderYCenter) < 30) {
                        largeExplosionSound();
                        shipDestroyed.style.display = 'block';
                        window.cancelAnimationFrame(stopMain);
                    } 
                }
            }   
            // if (starsControlPoint === true) {
            //     for (let i = 0; i < stars.length; i++) {
            //         stars[i].update();
            //         // Removing star from array if it leaves the top edge of the canvas.
            //         if (star[i].layers[5].y < 0) {
            //             let starIndex = stars.indexOf(stars[i]);
            //             stars.splice(starIndex, 1);
            //         }
            //     }
            // }
            
            enemyship.update();
            
            for (let i = 0; i < enemyBullets.length; i++) {
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