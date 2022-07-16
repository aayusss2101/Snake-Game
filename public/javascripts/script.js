import { Key } from "./key.js";
import { Audio } from './audio.js';
import { GameMode, GameStatus, Direction } from './constants.js';


class SnakeGame{
    box;
    applePos;
    snake;
    highScore;
    score;
    direction;
    lost;
    gameMode;
    tic;

    /**
     * Initialises the game states
     */
    init() {
        this.snake = [];
        this.applePos = {};
        if (this.highScore===undefined)
            this.highScore = 0;
        else
            this.highScore = Math.max(this.score, this.highScore);
        this.lost = false;
        this.direction = Direction.LEFT;
        this.score = 0;
    }

    constructor() {
        this.c = document.getElementById('board');
        this.ctx = this.c.getContext('2d');
        this.box = 32;
        this.init();
        this.background = new Image();
        this.background.src = 'images/background.png';
        this.apple = new Image();
        this.apple.src = 'images/apple.png';
        this.gameMode = GameMode.KEYBOARD;
        this.gameButton = document.getElementById('game-button');
        this.gameModeButton=document.getElementsByClassName('game-mode')[0]
    }

    /**
     * Toggles game mode from keyboard to audio and vice-versa 
     */
    toggleGameMode() {
        if (this.gameButton.innerHTML == GameStatus.STOP.name)
            return;
        const child = this.gameModeButton.querySelectorAll('input');
        const firstClass = child[0].className;
        const secondClass = child[1].className;
        child[0].className = secondClass;
        child[1].className = firstClass;
        if (this.gameMode === GameMode.KEYBOARD)
            this.gameMode = GameMode.AUDIO;
        else
            this.gameMode = GameMode.KEYBOARD;
    }

    /**
     * Adds text to the canvas
     * @param {String} text Message
     * @param {Number} posX X coordinate
     * @param {Number} posY Y coordinate
     * @param {Number} fontSize Font size
     * @param {String} font Font face
     * @param {Boolean} isStroke Whether the text should be filled or not
     */
    addTextToCanvas(text, posX, posY, fontSize, font, isStroke) {

        // Function to Add Text to Canvas
    
        this.ctx.font = `${fontSize}px ${font}`;
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.fillText(`${text}`, posX, posY);
        if (isStroke)
            this.ctx.strokeText(`${text}`, posX, posY);
    
    }

    /**
     * Draws the game board
     */
    drawBackground() {
        this.ctx.clearRect(0, 0, 608, 608);
        this.ctx.drawImage(this.background, 0, 0);
        this.addTextToCanvas(this.score, 3.2 * this.box, 1.9 * this.box, 40, 'Times New Roman', false);
        this.ctx.drawImage(this.apple, this.box * 2, this.box * 1);
    }

    /**
     * Finds the position of apple on the board
     */
    getApplePosition() {

        let x,y;
        let flag=true;
        while(flag){
            x=Math.floor(Math.random()*14+3);
            y=Math.floor(Math.random()*14+4);
            flag=false;
            for(let i = 0; i<this.snake.length; i++){
                if(x==this.snake[i]['x'] && y==this.snake[i]['y']){
                    flag=true;
                    break;
                }
            }
        }   
        this.applePos['x']=x;
        this.applePos['y']=y;
    }

    /**
     * Finds the direction of movement for the snake 
     * @param {Object} e Event object
     */
    getDirection(e) {
        if (this.gameMode == GameMode.KEYBOARD) {
            let flag = Key.getDirection(e, this.direction);
            if (flag === false)
                this.lost = true;
            else
                this.direction = flag;
        }
        if (this.gameMode == GameMode.AUDIO) {
            //console.log('audio direction')
            let flag = Audio.getDirection(e, this.direction);
            if (flag === false)
                this.lost = true;
            else
                this.direction = flag;
        }
    }
    
    /**
     * Provides with initial position and direction movement of the snake
     */
    snakeInit() {

        let x,y;
        x=Math.floor(Math.random()*14+3);
        y=Math.floor(Math.random()*14+4);
        this.snake.push({
            'x': x,
            'y': y
        });
        if(x<10)
            this.direction=Direction.RIGHT;
    }

    /**
     * Changes snake position depending on the movement direction
     * @param {Boolean} removeLast 
     */
    changeSnakePosition(removeLast = true) {

        let xnew,ynew,xcurr,ycurr;
        xcurr=this.snake[0]['x'];
        ycurr=this.snake[0]['y'];
        xnew=xcurr;
        ynew=ycurr;
        if(this.direction==Direction.UP)
            ynew--;
        else if(this.direction==Direction.DOWN)
            ynew++;
        else if(this.direction==Direction.LEFT)
            xnew--;
        else
            xnew++;
        this.snake.unshift({
            'x': xnew,
            'y': ynew
        });

        if (removeLast)
            this.snake.pop();
        
    }

    /**
     * Reinitialises the game once it is over
     */
    gameOver(){
    
        this.clear();
        this.addTextToCanvas('You Lost', 3 * this.box, 10 * this.box, 100, 'Pacifico', true);
        this.addTextToCanvas(`High Score: ${this.highScore}`, 4.8 * this.box, 12 * this.box, 50, 'Pacifico', true);
        this.gameButton.innerHTML = "Start Game";
    }

    /**
     * Clears the board and reinitialises the game states
     */
    clear() {
        
        // Function to Clear the Board and Score

        if (this.gameMode == GameMode.AUDIO)
            Audio.stop();
        this.drawBackground();
        this.init();
        clearInterval(this.tic);

    }

    /**
     * Draws all the components of the game on the canvas
     */
    draw() {
        this.drawBackground();
        this.ctx.drawImage(this.apple, this.box * this.applePos['x'], this.box * this.applePos['y']);
        for(let i = 0; i<this.snake.length; i++){
            this.ctx.strokeStyle="brown";
            if(i==0)
                this.ctx.fillStyle="black";
            else
                this.ctx.fillStyle="white";
            if(this.snake[i]['x']<2||this.snake[i]['x']>=17||this.snake[i]['y']<3||this.snake[i]['y']>=18){
                this.lost=true;
                break;
            }
            for(let j = i+1; j<this.snake.length; j++){
                if(this.snake[i]['x']==this.snake[j]['x'] && this.snake[i]['y']==this.snake[j]['y']){
                    this.lost = true;
                    break;
                }
            }
            if(this.lost)
                break;
            this.ctx.fillRect(this.box*this.snake[i]['x'],this.box*this.snake[i]['y'], this.box, this.box);
            this.ctx.strokeRect(this.box*this.snake[i]['x'],this.box*this.snake[i]['y'], this.box, this.box);
        }
        if(this.lost){
            this.gameOver();
            return;
        }
        if(this.snake[0]['x']==this.applePos['x'] && this.snake[0]['y']==this.applePos['y']){
            this.getApplePosition();
            this.changeSnakePosition(false);
            this.score++;
        }
        else
            this.changeSnakePosition();
    }

    /**
     * Main driver function of the game
     */
    play() {
        let self = this;
        if (this.gameMode == GameMode.KEYBOARD) {
            document.addEventListener('keydown', function (e) { self.getDirection(e); });
        }
        
        else {
            Audio.init();   
            Audio.recognition.onresult = function (e) {
                self.getDirection(e);
            }
        }
        if (this.gameButton.innerHTML == GameStatus.START.name) {
            this.snakeInit();
            this.getApplePosition();
            let time;
            if (this.gameMode == GameMode.KEYBOARD)
                time = 200;
            else
                time = 1100;
            this.tic = setInterval(function () { self.draw(); }, time);
            this.gameButton.innerHTML = GameStatus.STOP.name;
        }
        else {
            this.clear();
            this.addTextToCanvas('Game Ended', 2.2*this.box, 10*this.box, 85, "Pacifico", true);
            this.addTextToCanvas(`High Score: ${this.highScore}`, 4.5*this.box, 12*this.box, 50, 'Pacifico', true);
            this.gameButton.innerHTML = GameStatus.START.name;
        }
    }

    /**
     * Initialises the canvas
     */
    onLoad() {
        this.drawBackground();
        this.addTextToCanvas('Snake Run', 2.2*this.box, 10*this.box, 100, 'Pacifico', true);
        this.addTextToCanvas(`High Score: ${this.highScore}`, 4.5*this.box, 12*this.box, 50, 'Pacifico', true);
    }
}

let snakeGame = new SnakeGame();

window.addEventListener('load', (e) => {
    snakeGame.onLoad();
})

snakeGame.gameButton.onclick = function () {
    snakeGame.play();
};

snakeGame.gameModeButton.onclick = function () {
    snakeGame.toggleGameMode();
}