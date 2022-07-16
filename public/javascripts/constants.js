/**
 * Enum class for different game modes
 */
export class GameMode{
    static KEYBOARD = new GameMode('key');
    static AUDIO = new GameMode('audio');
    constructor(name) {
        this.name = name;
    }
}

/**
 * Enum class for different game statuses
 */
export class GameStatus{
    static START = new GameStatus('Start Game');
    static STOP = new GameStatus('End Game');
    constructor(name) {
        this.name = name;
    }
}

/**
 * Enum class for different directions
 */
export class Direction{
    static UP = new Direction('up');
    static DOWN = new Direction('down');
    static LEFT = new Direction('left');
    static RIGHT = new Direction('right'); 
    constructor(name) {
        this.name = name;
    }
}