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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Firebase.
    var config = {
        apiKey: "AIzaSyA-Ln53aTvKeyPdS1mTfWDKOQWcJWFdj4Q",
        authDomain: "space-shooter-scores.firebaseapp.com",
        databaseURL: "https://space-shooter-scores.firebaseio.com",
        projectId: "space-shooter-scores",
        storageBucket: "space-shooter-scores.appspot.com",
        messagingSenderId: "710847027007"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    var ref = database.ref('scores'); // Databse defined to add new records.
    var refSorted = database.ref('scores').orderByChild('score'); // Database defined to sort records.

    var playerScore = 0;
    // Function to not reload page, after clicking play again.
    var resetGameStatus = function resetGameStatus() {
        gameEnd.style.display = 'none';
        earthDestroyed.style.display = 'none';
        shipDestroyed.style.display = 'none';
        shipShot.style.display = 'none';
        score.style.display = 'none';
        playAgain.style.display = 'none';
        playerScore = 0;
        runGame();
    };
    // Function to push score to database.
    var updateScore = function updateScore() {
        var playerName = nameInput.value;
        if (playerName.length >= 15 || playerName.length === 0) {
            nameValidator.style.display = 'block';
        } else {
            var data = {
                name: playerName,
                score: playerScore
            };
            ref.push(data);
            resetGameStatus();
        }
    };

    var gotData = function gotData(data) {
        var ol = document.querySelector('.score-list');
        var scorelistings = document.querySelectorAll('.scorelistings');
        // Removing list before injecting new, actualized list.
        for (var i = 0; i < scorelistings.length; i++) {
            scorelistings[i].remove();
        }

        var scoresArray = [];
        // Saves cores to array. Required to flip records(highest score to lowest score).
        var scores = data.forEach(function (child) {
            scoresArray.push(child.val());
        });

        var counter = 1;
        // Flipping records and injecting to HTML.
        for (var _i = scoresArray.length - 1; _i >= 0; _i--) {
            var name = scoresArray[_i].name;
            var score = scoresArray[_i].score;
            var li = document.createElement('li');
            li.innerText = counter + ". " + name + ': ' + score;
            li.className = 'scorelistings';
            counter += 1;
            ol.appendChild(li);
        }
    };

    var errData = function errData(error) {
        console.log('Error');
        console.log(error);
    };

    var getScores = function getScores() {
        refSorted.once('value', gotData, errData); // Firbase method to get scores from database.
    };
    getScores();

    var showScores = function showScores() {
        getScores();
        scoresWrapper.style.zIndex = '6';
    };

    var hideScores = function hideScores() {
        scoresWrapper.style.zIndex = '1';
    };

    // Game state information divs.
    var gameEnd = document.getElementById('game-end');
    var score = document.getElementById('score');
    var shipDestroyed = document.getElementById('ship-destroyed');
    var earthDestroyed = document.getElementById('earth-destroyed');
    var shipShot = document.getElementById('ship-shot');
    var playAgain = document.getElementById('play-again');
    var gameEndMessage = document.getElementById('game-end');
    var submitScore = document.querySelector('.send-button');
    var nameInput = document.querySelector('.player');
    var nameValidator = document.querySelector('.name-validator');
    var highScores = document.querySelector('.highscores');
    var closeButton = document.querySelector('.close-scorelist');
    var scoresWrapper = document.querySelector('.scores-wrapper');
    var startingScreen = document.querySelector('.starting-screen');
    var startButton = document.querySelector('.start-button');
    var leftMobile = document.querySelector('.left-button');
    var rightMobile = document.querySelector('.right-button');

    submitScore.addEventListener('click', updateScore);
    playAgain.addEventListener('click', resetGameStatus);
    highScores.addEventListener('click', showScores);
    closeButton.addEventListener('click', hideScores);
    startButton.addEventListener('click', function () {
        runGame();
        runSound();
        startingScreen.style.display = 'none';
    });

    // Function to handle music.
    var runSound = function runSound() {
        var musicController = document.querySelector('.music-handler');
        musicController.style.display = 'block';
        // Load the sounds.
        sounds.load(['sounds/01 The Misadventure Begins.mp3', 'sounds/laser2.mp3']);

        var music = sounds['sounds/01 The Misadventure Begins.mp3'];
        var shootSound = sounds['sounds/laser2.mp3'];
        var musicHandler = true;
        var setup = function setup() {
            // Set the music volume.
            music.volume = 0.2;
            // Make the music loop.
            music.loop = true;
            if (musicHandler === false) {
                music.pause();
                musicController.style.color = 'rgba(255, 255, 255, 0.5)';
                musicHandler = true;
            } else if (musicHandler === true) {
                music.play();
                musicController.style.color = 'white';
                musicHandler = false;
            }
        };
        var keyPressHandler = function keyPressHandler(e) {
            shootSound.volume = 0.08;
            if (e.key === 'x') {
                // Shoot sound volume.
                shootSound.play();
            }
        };
        // Assign the callback function that should run when the sounds have loaded.
        sounds.whenLoaded = setup;
        musicController.addEventListener('click', setup);
        document.addEventListener('keypress', keyPressHandler, false);
    };

    // Function to handle game.
    var runGame = function runGame() {

        // --- VARIABLES ---
        var canvas = document.querySelector('#canvas');
        var c = canvas.getContext('2d');
        var innerWidth = canvas.width = canvas.scrollWidth;
        var innerHeight = canvas.height = canvas.scrollHeight;

        var gameOver = false;

        var player = void 0;

        var p = 4; // Size of single pixel, used to create the ship.
        var ep = 5; // Size of single pixel, used to create the enemyeship.
        var ip = 4; // Size of single pixel, used to create the invader.
        var sp = 4; // Size of single pixel, used to create the star.

        var starsArray = void 0; // Array to store background stars.
        var spaceship = void 0;
        var bullet = void 0;
        var bullets = []; // Array to store bullets.

        var invaders = []; // Array to store invaders.
        var invadersDropTime = 6000; // Asteroids drop time.
        var invadersControlPoint = false;

        var enemyship = void 0;
        var enemyBullets = []; // Array to store enemy bullets.

        var xStartingPoint = innerWidth / 2 + p; // Starting X coordinate of spaceship and bullets.
        var yStartingPoint = innerHeight - 110 + p; // Starting Y coordinate of spaceship and bullets.
        // Bullet properties - declared outside init function bcs needed in keypress event.
        var bulletProps = {
            x: xStartingPoint.x,
            y: yStartingPoint + p * 2,
            width: p * 2,
            height: p * 3,
            color: 'orange'
        };

        var enemyXStartingPoint = innerWidth / 2; // Starting X coordinate of enemyship and bullets.
        var enemyYStartingPoint = ep * 6; // Starting Y coordinate of enemyship and bullets.

        var stars = [];
        var starsDropTime = 10000; // Star drop time.
        var starsControlPoint = false;

        var infoBox = document.getElementById('info'); // Game controls information.
        var timer = setTimeout(function () {
            infoBox.style.display = 'none';
        }, 7000);

        // --- UTILITY FUNCTIONS ---

        var randomIntFromRange = function randomIntFromRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };

        var getRandomColor = function getRandomColor(array) {
            return array[Math.floor(Math.random() * array.length)];
        };
        // Function to detect collision.
        var getDistance = function getDistance(x1, y1, x2, y2) {
            var xDistance = x2 - x1;
            var yDistance = y2 - y1;
            // Pythagorean Theorem.
            return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        };

        // Sound effects.       
        var smallExplosionSound = function smallExplosionSound() {
            soundEffect(16, //frequency
            0, //attack
            0.2, //decay
            "sawtooth", //waveform
            0.1, //volume
            0, //pan
            0, //wait before playing
            0, //pitch bend amount
            false, //reverse
            0, //random pitch range
            50, //dissonance
            undefined, //echo array: [delay, feedback, filter]
            undefined //reverb array: [duration, decay, reverse?]
            );
        };

        var largeExplosionSound = function largeExplosionSound() {
            soundEffect(16, //frequency
            0, //attack
            1.2, //decay
            "sawtooth", //waveform
            0.1, //volume
            0, //pan
            0, //wait before playing
            0, //pitch bend amount
            false, //reverse
            0, //random pitch range
            50, //dissonance
            undefined, //echo array: [delay, feedback, filter]
            undefined //reverb array: [duration, decay, reverse?]
            );
        };

        var bonusSound = function bonusSound() {
            //D
            soundEffect(587.33, 0, 0.2, "square", 0.1, 0, 0);
            //A
            soundEffect(880, 0, 0.2, "square", 0.1, 0, 0.1);
            //High D
            soundEffect(1174.66, 0, 0.3, "square", 0.1, 0, 0.2);
        };

        // --- EVENTS ---

        // -- Spaceship Movement and shooting--

        var rightPressed = false;
        var leftPressed = false;
        var upPressed = false;
        var downPressed = false;

        // Keyboard controls.
        var keyDownHandler = function keyDownHandler(e) {
            if (e.keyCode === 39) {
                rightPressed = true;
            } else if (e.keyCode === 37) {
                leftPressed = true;
            } else if (e.keyCode === 38) {
                upPressed = true;
            } else if (e.keyCode === 40) {
                downPressed = true;
            }
        };

        var keyUpHandler = function keyUpHandler(e) {
            if (e.keyCode === 39) {
                rightPressed = false;
            } else if (e.keyCode === 37) {
                leftPressed = false;
            } else if (e.keyCode === 38) {
                upPressed = false;
            } else if (e.keyCode === 40) {
                downPressed = false;
            }
        };

        var keyPressHandler = function keyPressHandler(e) {
            if (e.key === 'x') {
                var _bullet = new Bullet(bulletProps);
                _bullet.x = spaceship.layers[0].x;
                _bullet.y = spaceship.layers[0].y;
                bullets.push(_bullet);
            }
        };

        // Touch controls.
        var handleStartLeft = function handleStartLeft() {
            leftPressed = true;
            var bullet = new Bullet(bulletProps);
            bullet.x = spaceship.layers[0].x;
            bullet.y = spaceship.layers[0].y;
            bullets.push(bullet);
        };

        var handleEndLeft = function handleEndLeft() {
            leftPressed = false;
        };

        var handleStartRight = function handleStartRight() {
            rightPressed = true;
            var bullet = new Bullet(bulletProps);
            bullet.x = spaceship.layers[0].x;
            bullet.y = spaceship.layers[0].y;
            bullets.push(bullet);
        };

        var handleEndRight = function handleEndRight() {
            rightPressed = false;
        };

        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);
        document.addEventListener('keypress', keyPressHandler, false);
        leftMobile.addEventListener("touchstart", handleStartLeft, false);
        leftMobile.addEventListener("touchend", handleEndLeft, false);
        rightMobile.addEventListener("touchstart", handleStartRight, false);
        rightMobile.addEventListener("touchend", handleEndRight, false);

        // --- CONSTRUCTOR CLASSES---

        //  -- Player class --

        var Player = function () {
            function Player(player) {
                _classCallCheck(this, Player);

                this.x = player.x;
                this.y = player.y;
                this.font = player.font;
                this.text = player.text;
                this.color = player.color;
            }

            _createClass(Player, [{
                key: "draw",
                value: function draw() {
                    c.fillStyle = this.color;
                    c.font = this.font;
                    c.fillText(this.text, this.x, this.y);
                }
            }, {
                key: "update",
                value: function update() {
                    this.text = 'Score: ' + playerScore;
                    this.draw();
                }
            }]);

            return Player;
        }();

        //  -- Base rectangle class --


        var Rectangle = function Rectangle(rect) {
            _classCallCheck(this, Rectangle);

            this.x = rect.x;
            this.y = rect.y;
            this.width = rect.width;
            this.height = rect.height;
            this.color = rect.color;
        };

        // -- Background Stars --


        var BackgroundStars = function (_Rectangle) {
            _inherits(BackgroundStars, _Rectangle);

            function BackgroundStars(stars) {
                _classCallCheck(this, BackgroundStars);

                var _this = _possibleConstructorReturn(this, (BackgroundStars.__proto__ || Object.getPrototypeOf(BackgroundStars)).call(this, stars));

                _this.dy = stars.dy;
                return _this;
            }

            _createClass(BackgroundStars, [{
                key: "draw",
                value: function draw() {
                    c.fillStyle = this.color;
                    c.fillRect(this.x, this.y, this.width, this.height);
                    c.fillRect(this.x, this.y, this.width, this.height);
                }
            }, {
                key: "update",
                value: function update() {

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
            }]);

            return BackgroundStars;
        }(Rectangle);

        // -- Invader --


        var Invader = function () {
            function Invader(object) {
                _classCallCheck(this, Invader);

                this.layers = object.layers; // Layers (array of objects) to draw more complicated shapes from numbers of rectangles.
                this.dy = object.dy;
            }

            _createClass(Invader, [{
                key: "draw",
                value: function draw() {
                    for (var i = 0; i < this.layers.length; i++) {
                        var data = this.layers[i];
                        var loc = {
                            x: data.x,
                            y: data.y,
                            width: data.width,
                            height: data.height,
                            color: data.color
                        };
                        c.fillStyle = loc.color;
                        c.fillRect(loc.x, loc.y, loc.width, loc.height);
                    }
                }
            }, {
                key: "update",
                value: function update() {
                    for (var i = 0; i < this.layers.length; i++) {
                        this.layers[i].y += this.dy;
                    }
                    this.draw();
                }
            }]);

            return Invader;
        }();

        // -- Spaceship ---


        var Spaceship = function () {
            function Spaceship(ship) {
                _classCallCheck(this, Spaceship);

                this.layers = ship.layers; // Layers (array of objects) to draw more complicated shapes from numbers of rectangles.
            }

            _createClass(Spaceship, [{
                key: "draw",
                value: function draw() {
                    for (var i = 0; i < this.layers.length; i++) {
                        var data = this.layers[i];
                        var loc = {
                            x: data.x,
                            y: data.y,
                            width: data.width,
                            height: data.height,
                            color: data.color
                        };
                        c.fillStyle = loc.color;
                        c.fillRect(loc.x, loc.y, loc.width, loc.height);
                    }
                }
            }, {
                key: "update",
                value: function update() {
                    for (var i = 0; i < this.layers.length; i++) {
                        // Applied controls to all spaceship layers.
                        if (rightPressed && this.layers[20].x < innerWidth - 25) {
                            this.layers[i].x += 6;
                        } else if (leftPressed && this.layers[20].x > 55) {
                            this.layers[i].x -= 6;
                        } else if (upPressed && this.layers[20].y > 20) {
                            this.layers[i].y -= 6;
                        } else if (downPressed && this.layers[20].y < innerHeight - 10) {
                            this.layers[i].y += 6;
                        }
                    }
                    this.draw();
                }
            }]);

            return Spaceship;
        }();

        // -- Bullet --


        var Bullet = function () {
            function Bullet(bullet) {
                _classCallCheck(this, Bullet);

                this.x = bullet.x;
                this.y = bullet.y;
                this.width = bullet.width;
                this.height = bullet.height;
                this.color = bullet.color;
            }

            _createClass(Bullet, [{
                key: "draw",
                value: function draw() {
                    c.fillStyle = this.color;
                    c.fillRect(this.x, this.y, this.width, this.height);
                }
            }, {
                key: "update",
                value: function update() {
                    var dy = 10;
                    this.y -= dy;
                    this.draw();
                }
            }]);

            return Bullet;
        }();

        // -- Enemy ship --


        var EnemyShip = function () {
            function EnemyShip(object) {
                _classCallCheck(this, EnemyShip);

                this.layers = object.layers; // Layers (array of objects) to draw more complicated shapes from numbers of rectangles.
                this.dx = object.dx;
            }

            _createClass(EnemyShip, [{
                key: "draw",
                value: function draw() {
                    for (var i = 0; i < this.layers.length; i++) {
                        var data = this.layers[i];
                        var loc = {
                            x: data.x,
                            y: data.y,
                            width: data.width,
                            height: data.height,
                            color: data.color
                        };
                        c.fillStyle = loc.color;
                        c.fillRect(loc.x, loc.y, loc.width, loc.height);
                    }
                }
            }, {
                key: "update",
                value: function update() {
                    for (var i = 0; i < this.layers.length; i++) {
                        if (this.layers[i].x + this.layers[i].width > innerWidth || this.layers[i].x < 0) {
                            this.dx = -this.dx;
                        }
                        this.layers[i].x += this.dx;
                    }
                    this.draw();
                }
            }]);

            return EnemyShip;
        }();

        // -- Bullet --


        var EnemyBullet = function () {
            function EnemyBullet(bullet) {
                _classCallCheck(this, EnemyBullet);

                this.x = bullet.x;
                this.y = bullet.y;
                this.width = bullet.width;
                this.height = bullet.height;
                this.color = bullet.color;
            }

            _createClass(EnemyBullet, [{
                key: "draw",
                value: function draw() {
                    c.fillStyle = this.color;
                    c.fillRect(this.x, this.y, this.width, this.height);
                }
            }, {
                key: "update",
                value: function update() {
                    var dy = 5;
                    this.y += dy;
                    this.draw();
                }
            }]);

            return EnemyBullet;
        }();

        // -- Enemy ship --


        var Star = function () {
            function Star(object) {
                _classCallCheck(this, Star);

                this.layers = object.layers; // Layers (array of objects) to draw more complicated shapes from numbers of rectangles.
                this.dy = object.dy;
            }

            _createClass(Star, [{
                key: "draw",
                value: function draw() {
                    for (var i = 0; i < this.layers.length; i++) {
                        var data = this.layers[i];
                        var loc = {
                            x: data.x,
                            y: data.y,
                            width: data.width,
                            height: data.height,
                            color: data.color
                        };
                        c.fillStyle = loc.color;
                        c.fillRect(loc.x, loc.y, loc.width, loc.height);
                    }
                }
            }, {
                key: "update",
                value: function update() {
                    for (var i = 0; i < this.layers.length; i++) {
                        this.layers[i].y += this.dy;
                    }
                    this.draw();
                }
            }]);

            return Star;
        }();

        // --- FUNCTION TO INITIALIZE CANVAS ---

        var init = function init() {
            // Player.
            var playerProps = {
                x: innerWidth - 100,
                y: 0 + 40,
                font: '24px sh_pinscherregular',
                color: 'white'
            };
            player = new Player(playerProps);

            // Background stars.
            var dropsNumber = 40;
            starsArray = [];
            for (var i = 0; i < dropsNumber; i++) {
                var starProps = {
                    x: randomIntFromRange(10, innerWidth - 10),
                    y: randomIntFromRange(-100, -300),
                    dy: randomIntFromRange(6, 10),
                    width: randomIntFromRange(2, 3),
                    height: randomIntFromRange(10, 14)
                };
                // Alternative stars size to create more stars in background.
                var alterStarProps = {
                    x: randomIntFromRange(10, innerWidth - 10),
                    y: randomIntFromRange(-100, -300),
                    dy: randomIntFromRange(6, 10),
                    width: randomIntFromRange(2, 4),
                    height: randomIntFromRange(10, 14),
                    widthBg: 2,
                    heightBg: 10
                };
                var halfDropsNumber = dropsNumber / 2;
                // Creating more stars on the background (realistic effect).
                if (i < halfDropsNumber) {
                    starProps.color = getRandomColor(['white', 'rgb(50, 50, 140)']);
                    starsArray.push(new BackgroundStars(starProps));
                } else {
                    starProps.color = getRandomColor(['white', 'rgb(50, 50, 140)']);
                    starsArray.push(new BackgroundStars(alterStarProps));
                }
            }

            // Invaders.
            var invadersNumber = 10;
            var invadersDrop = function invadersDrop() {
                var timer = setInterval(function () {
                    invadersControlPoint = true;
                    for (var _i2 = 0; _i2 < invadersNumber; _i2++) {
                        var invaderXStartingPoint = randomIntFromRange(30, innerWidth - 50); // Starting X coordinate of invaders.
                        var invaderYStartingPoint = randomIntFromRange(-100, -400); // Starting Y coordinate of invaders.
                        var invaderProps = {
                            layers: [{ color: 'lime', x: invaderXStartingPoint, y: invaderYStartingPoint, width: ip, height: ip }, { color: 'lime', x: invaderXStartingPoint + ip * 3, y: invaderYStartingPoint, width: ip, height: ip }, { color: 'lime', x: invaderXStartingPoint - ip, y: invaderYStartingPoint + ip, width: ip * 6, height: ip }, { color: 'lime', x: invaderXStartingPoint - ip * 2, y: invaderYStartingPoint + ip * 2, width: ip * 8, height: ip }, { color: 'lime', x: invaderXStartingPoint - ip * 3, y: invaderYStartingPoint + ip * 3, width: ip * 10, height: ip }, { color: 'lime', x: invaderXStartingPoint - ip * 3, y: invaderYStartingPoint + ip * 4, width: ip * 10, height: ip }, { color: 'lime', x: invaderXStartingPoint - ip * 3, y: invaderYStartingPoint + ip * 5, width: ip * 10, height: ip }, { color: 'lime', x: invaderXStartingPoint - ip * 3, y: invaderYStartingPoint + ip * 6, width: ip * 10, height: ip }, { color: 'black', x: invaderXStartingPoint - ip, y: invaderYStartingPoint + ip * 3, width: ip * 2, height: ip }, { color: 'black', x: invaderXStartingPoint + ip * 3, y: invaderYStartingPoint + ip * 3, width: ip * 2, height: ip }, { color: 'black', x: invaderXStartingPoint - ip, y: invaderYStartingPoint + ip * 6, width: ip, height: ip }, { color: 'black', x: invaderXStartingPoint + ip, y: invaderYStartingPoint + ip * 6, width: ip, height: ip }, { color: 'black', x: invaderXStartingPoint + ip * 2, y: invaderYStartingPoint + ip * 6, width: ip, height: ip }, { color: 'black', x: invaderXStartingPoint + ip * 4, y: invaderYStartingPoint + ip * 6, width: ip, height: ip }],
                            dy: randomIntFromRange(1, 2.5)
                        };
                        var invader = new Invader(invaderProps);
                        if (gameOver === false) {
                            invaders.push(invader);
                        }
                    }
                }, invadersDropTime);
            };
            invadersDrop();

            // Spaceship.
            var shipProps = {
                layers: [{ color: 'white', x: xStartingPoint, y: yStartingPoint, width: p * 2, height: p * 4 }, { color: 'white', x: xStartingPoint - p, y: yStartingPoint + p * 4, width: p * 4, height: p * 2 }, { color: 'white', x: xStartingPoint - p * 2, y: yStartingPoint + p * 6, width: p * 6, height: p * 2 }, { color: 'white', x: xStartingPoint - p * 3, y: yStartingPoint + p * 8, width: p * 8, height: p * 2 }, { color: 'white', x: xStartingPoint - p * 4, y: yStartingPoint + p * 10, width: p * 10, height: p * 2 }, { color: 'white', x: xStartingPoint - p * 5, y: yStartingPoint + p * 12, width: p * 12, height: p }, { color: 'white', x: xStartingPoint - p * 6, y: yStartingPoint + p * 13, width: p * 14, height: p }, { color: 'white', x: xStartingPoint - p * 7, y: yStartingPoint + p * 14, width: p * 16, height: p }, { color: 'blue', x: xStartingPoint, y: yStartingPoint + p * 7, width: p * 2, height: p }, { color: 'blue', x: xStartingPoint - p, y: yStartingPoint + p * 8, width: p * 4, height: p * 2 }, { color: 'blue', x: xStartingPoint - p * 2, y: yStartingPoint + p * 10, width: p * 6, height: p * 2 }, { color: 'red', x: xStartingPoint - p, y: yStartingPoint + p * 14, width: p * 4, height: p }, { color: 'red', x: xStartingPoint - p, y: yStartingPoint + p * 15, width: p * 4, height: p }, { color: 'orangered', x: xStartingPoint, y: yStartingPoint + p * 14, width: p * 2, height: p }, { color: 'orangered', x: xStartingPoint, y: yStartingPoint + p * 15, width: p * 2, height: p }, { color: 'red', x: xStartingPoint, y: yStartingPoint + p * 16, width: p * 2, height: p * 2 }, { color: 'lightblue', x: xStartingPoint + p, y: yStartingPoint + p * 8, width: p, height: p }, { color: 'lightblue', x: xStartingPoint + p, y: yStartingPoint + p * 9, width: p, height: p }, { color: 'lightblue', x: xStartingPoint + p, y: yStartingPoint + p * 10, width: p * 2, height: p }, { color: 'white', x: xStartingPoint - p * 7, y: yStartingPoint + p * 15, width: p * 4, height: p }, { color: 'white', x: xStartingPoint + p * 5, y: yStartingPoint + p * 15, width: p * 4, height: p }]
            };
            // Function to create jet engine effect.
            var blinkEngine = function blinkEngine() {
                var color = '';
                var controler = false;
                var timer = setInterval(function () {
                    if (controler === false) {
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
            };
            spaceship = new Spaceship(shipProps);
            blinkEngine();

            // Enemy ship
            var enemyProps = {
                layers: [{ color: 'blue', x: enemyXStartingPoint, y: enemyYStartingPoint, width: ep * 4, height: ep }, { color: 'blue', x: enemyXStartingPoint - ep * 4, y: enemyYStartingPoint + ep, width: ep * 12, height: ep }, { color: 'blue', x: enemyXStartingPoint - ep * 5, y: enemyYStartingPoint + ep * 2, width: ep * 14, height: ep }, { color: 'blue', x: enemyXStartingPoint - ep * 6, y: enemyYStartingPoint + ep * 3, width: ep * 16, height: ep }, { color: 'blue', x: enemyXStartingPoint - ep * 6, y: enemyYStartingPoint + ep * 4, width: ep * 16, height: ep }, { color: 'lightgray', x: enemyXStartingPoint - ep * 8, y: enemyYStartingPoint + ep * 5, width: ep * 20, height: ep }, { color: 'darkgray', x: enemyXStartingPoint - ep * 9, y: enemyYStartingPoint + ep * 6, width: ep * 22, height: ep }, { color: 'gray', x: enemyXStartingPoint - ep * 10, y: enemyYStartingPoint + ep * 7, width: ep * 24, height: ep }, { color: 'darkgray', x: enemyXStartingPoint - ep * 9, y: enemyYStartingPoint + ep * 8, width: ep * 22, height: ep }, { color: 'lightgray', x: enemyXStartingPoint - ep * 8, y: enemyYStartingPoint + ep * 9, width: ep * 20, height: ep }, { color: 'gray', x: enemyXStartingPoint - ep * 6, y: enemyYStartingPoint + ep * 10, width: ep * 16, height: ep }, { color: 'lightblue', x: enemyXStartingPoint + ep * 3, y: enemyYStartingPoint + ep, width: ep * 3, height: ep }, { color: 'lightblue', x: enemyXStartingPoint + ep * 4, y: enemyYStartingPoint + ep * 2, width: ep * 3, height: ep }, { color: 'lightblue', x: enemyXStartingPoint + ep * 5, y: enemyYStartingPoint + ep * 3, width: ep * 2, height: ep }, { color: 'cyan', x: enemyXStartingPoint - ep * 7, y: enemyYStartingPoint + ep * 7, width: ep, height: ep }, { color: 'cyan', x: enemyXStartingPoint + ep * 10, y: enemyYStartingPoint + ep * 7, width: ep, height: ep }, { color: 'cyan', x: enemyXStartingPoint - ep, y: enemyYStartingPoint + ep * 7, width: ep, height: ep }, { color: 'cyan', x: enemyXStartingPoint + ep * 4, y: enemyYStartingPoint + ep * 7, width: ep, height: ep }, { color: 'cyan', x: enemyXStartingPoint - ep * 4, y: enemyYStartingPoint + ep * 12, width: ep * 12, height: ep }, { color: 'cyan', x: enemyXStartingPoint - ep * 2, y: enemyYStartingPoint + ep * 14, width: ep * 8, height: ep }],
                dx: 1
                // Function to create blinking lights effect.
            };var blinkLights = function blinkLights() {
                var color = '';
                var controler = false;
                var timer = setInterval(function () {
                    if (controler === false) {
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
            };
            blinkLights();
            enemyship = new EnemyShip(enemyProps);

            // Enemy bullets.
            var enemyShooting = function enemyShooting() {
                var enemyBulletProps = {
                    x: enemyXStartingPoint,
                    y: enemyYStartingPoint,
                    width: p * 2,
                    height: p * 3,
                    color: 'cyan'
                };
                var timer = setInterval(function () {
                    var bullet = new EnemyBullet(enemyBulletProps);
                    bullet.x = enemyship.layers[19].x + p * 2;
                    bullet.y = enemyship.layers[19].y + p * 2;
                    if (gameOver === false) {
                        enemyBullets.unshift(bullet);
                    }
                }, 1000);
            };
            enemyShooting();

            // Star.
            var starDrop = function starDrop() {
                var starsNumber = 1;
                var timer = setInterval(function () {
                    starsControlPoint = true;
                    for (var _i3 = 0; _i3 < starsNumber; _i3++) {
                        var starXStartingPoint = randomIntFromRange(30, innerWidth - 30); // Starting X coordinate of star.
                        var starYStartingPoint = randomIntFromRange(-100, -400); // Starting Y coordinate of star.
                        var _starProps = {
                            layers: [{ color: 'yellow', x: starXStartingPoint, y: starYStartingPoint, width: sp * 2, height: sp }, { color: 'yellow', x: starXStartingPoint, y: starYStartingPoint + sp, width: sp * 2, height: sp }, { color: 'yellow', x: starXStartingPoint - sp, y: starYStartingPoint + sp * 2, width: sp * 4, height: sp }, { color: 'yellow', x: starXStartingPoint - sp, y: starYStartingPoint + sp * 3, width: sp * 4, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 2, y: starYStartingPoint + sp * 4, width: sp * 6, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 6, y: starYStartingPoint + sp * 5, width: sp * 14, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 5, y: starYStartingPoint + sp * 6, width: sp * 12, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 4, y: starYStartingPoint + sp * 7, width: sp * 10, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 3, y: starYStartingPoint + sp * 8, width: sp * 8, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 2, y: starYStartingPoint + sp * 9, width: sp * 6, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 2, y: starYStartingPoint + sp * 10, width: sp * 6, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 3, y: starYStartingPoint + sp * 11, width: sp * 8, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 3, y: starYStartingPoint + sp * 12, width: sp * 8, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 3, y: starYStartingPoint + sp * 13, width: sp * 2, height: sp }, { color: 'yellow', x: starXStartingPoint + sp * 3, y: starYStartingPoint + sp * 13, width: sp * 2, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 4, y: starYStartingPoint + sp * 14, width: sp * 2, height: sp }, { color: 'yellow', x: starXStartingPoint + sp * 4, y: starYStartingPoint + sp * 14, width: sp * 2, height: sp }, { color: 'yellow', x: starXStartingPoint - sp * 4, y: starYStartingPoint + sp * 15, width: sp * 2, height: sp }, { color: 'yellow', x: starXStartingPoint + sp * 4, y: starYStartingPoint + sp * 15, width: sp * 2, height: sp }, { color: 'black', x: starXStartingPoint - sp, y: starYStartingPoint + sp * 6, width: sp, height: sp * 2 }, { color: 'black', x: starXStartingPoint + sp * 2, y: starYStartingPoint + sp * 6, width: sp, height: sp * 2 }, { color: 'black', x: starXStartingPoint - sp / 2, y: starYStartingPoint + sp * 10, width: sp * 3, height: sp }, { color: 'black', x: starXStartingPoint - sp, y: starYStartingPoint + sp * 9, width: sp, height: sp }, { color: 'black', x: starXStartingPoint + sp * 2, y: starYStartingPoint + sp * 9, width: sp, height: sp }],
                            dy: randomIntFromRange(2, 3)
                        };
                        var star = new Star(_starProps);
                        if (gameOver === false) {
                            stars.push(star);
                        }
                    }
                }, starsDropTime);
            };
            starDrop();
        };

        var showEndGameInfo = function showEndGameInfo(element) {
            gameOver = true;
            largeExplosionSound();
            if (playerScore >= 100) {
                score.style.display = 'block';
            } else {
                playAgain.style.display = 'block';
            }
            gameEnd.style.display = 'block';
            element.style.display = 'block';
        };

        // --- MAIN ANIMATION LOOP ---

        (function () {
            var main = function main() {
                var stopMain = window.requestAnimationFrame(main); // Variable to easy stop main loop.
                // Main loop content.
                c.clearRect(0, 0, innerWidth, innerHeight);
                var starsLength = starsArray.length;
                for (var i = 0; i < starsLength; i++) {
                    starsArray[i].update();
                }

                spaceship.update();
                // Spaceship center.
                var shipXCenter = spaceship.layers[8].x + spaceship.layers[8].width / 2;
                var shipYCenter = spaceship.layers[8].y - spaceship.layers[8].height / 2;

                for (var _i4 = 0; _i4 < bullets.length; _i4++) {
                    bullets[_i4].update();
                    // Removing bullet from array if it leaves the top edge of the canvas.
                    if (bullets[_i4].y < 0) {
                        var bulletIndex = bullets.indexOf(bullets[_i4]);
                        bullets.splice(bulletIndex, 1);
                    }
                    for (var j = 0; j < invaders.length; j++) {
                        var invaderXCenter = invaders[j].layers[5].x + invaders[j].layers[5].width / 2;
                        var invaderYCenter = invaders[j].layers[5].y - invaders[j].layers[5].height / 2;
                        // Collision effect between bullet and invader.
                        if (bullets[_i4] != undefined && getDistance(bullets[_i4].x, bullets[_i4].y, invaderXCenter, invaderYCenter) < 20) {
                            smallExplosionSound();
                            playerScore += 1;
                            var index = invaders.indexOf(invaders[j]);
                            var _bulletIndex = bullets.indexOf(bullets[_i4]);
                            bullets.splice(_bulletIndex, 1); // Collided bullet removed from array.
                            invaders.splice(index, 1); // Collided invader removed from array.
                        }
                    }
                }

                if (invadersControlPoint === true) {
                    for (var _i5 = 0; _i5 < invaders.length; _i5++) {
                        invaders[_i5].update();
                        // Stopping game when invader leaves the bottom edge of the canvas.
                        if (invaders[_i5] !== undefined && invaders[_i5].layers[5].y > innerHeight) {
                            showEndGameInfo(earthDestroyed);
                            window.cancelAnimationFrame(stopMain);
                        }
                        var _invaderXCenter = invaders[_i5].layers[5].x + invaders[_i5].layers[5].width / 2;
                        var _invaderYCenter = invaders[_i5].layers[5].y - invaders[_i5].layers[5].height / 2;
                        // Collision effect between ship and invader.  
                        if (getDistance(shipXCenter, shipYCenter, _invaderXCenter, _invaderYCenter) < 30) {
                            showEndGameInfo(shipDestroyed);
                            window.cancelAnimationFrame(stopMain);
                        }
                    }
                }

                if (starsControlPoint === true && stars.length > 0) {
                    for (var _i6 = 0; _i6 < stars.length; _i6++) {
                        stars[_i6].update();
                        var starXCenter = stars[_i6].layers[9].x + stars[_i6].layers[9].width / 2;
                        var starYCenter = stars[_i6].layers[9].y - stars[_i6].layers[9].height / 2;
                        // Collision effect between ship and star.  
                        var starIndex = stars.indexOf(stars[_i6]);
                        if (getDistance(shipXCenter, shipYCenter, starXCenter, starYCenter) < 40) {
                            playerScore += 10;
                            bonusSound();
                            stars.splice(starIndex, 1);
                        }
                        // Removing star from array, if it leaves the bottom edge of the canvas.
                        if (stars.length > 0 && stars[_i6].layers[5].y > innerHeight) {
                            stars.splice(starIndex, 1);
                        }
                    }
                }

                enemyship.update();

                for (var _i7 = 0; _i7 < enemyBullets.length; _i7++) {
                    enemyBullets[_i7].update();
                    // Colission effect between enemy bullet and ship.
                    if (getDistance(spaceship.layers[8].x, spaceship.layers[8].y, enemyBullets[_i7].x, enemyBullets[_i7].y) < 20) {
                        showEndGameInfo(shipShot);
                        window.cancelAnimationFrame(stopMain);
                    }
                    // Removing enemy bullet from array if it leaves the bottom edge of the canvas.
                    var _bulletIndex2 = enemyBullets.indexOf(enemyBullets[_i7]);
                    if (enemyBullets[_i7].y > innerHeight) {
                        enemyBullets.splice(_bulletIndex2, 1);
                    }
                }
                player.update();
            };
            init(); // Initialize canvas with objects.
            main(); // Start the cycle.
        })();
    };
});

/***/ })
/******/ ]);