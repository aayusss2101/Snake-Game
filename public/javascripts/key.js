import { Direction } from "./constants.js";


export class Key{
    /**
     * Finds the direction of movement for the snake using keyboard presses
     * @param {Object} e Event object
     * @param {Direction} oldDirection Previous direction of snake
     * @returns 
     */
    static getDirection(e, oldDirection) {
        if(e.code=="ArrowUp"){
            if (oldDirection != Direction.DOWN)
                return Direction.UP;
        }
        else if(e.code=="ArrowDown"){
            if(oldDirection!=Direction.UP)
                return Direction.DOWN;
        }
        else if(e.code=="ArrowLeft"){
            if(oldDirection!=Direction.RIGHT)
                return Direction.LEFT;
        }
        else if(e.code=="ArrowRight"){
            if(oldDirection!=Direction.LEFT)
                return Direction.RIGHT;
        }
        return false;
    }
}