import { Direction } from "./constants.js";


export class Audio{
    static recognition;
    static flag;
    /**
     * Initialises the audio recorder and the necessary states
     */
    static init() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.start();
        this.flag = false;
        let self = this;
        this.recognition.onend = function (e) {
            if (!self.flag) {
                try {
                    self.recognition.start();
                } catch (e) { }
            }
        }
    }
    /**
     * Finds the similarity between two strings
     * @param {String} a First string
     * @param {String} b Second string
     * @returns Similarity ratio between the strings
     */
    static getSimilarity(a, b) { 
        let s = new difflib.SequenceMatcher(null, a, b);
        return s.ratio();
    }
    /**
     * Finds the closest direction that can be inferred from the transcription
     * @param {String} t Transcription string
     * @returns False if no direction was identifiable else the correct direction
     */
    static getSimilarDirection(t) {
        let directions = [Direction.UP.name, Direction.DOWN.name, Direction.LEFT.name, Direction.RIGHT.name];
        let maxScore = -1, ctr = t;
        for (let d in directions) {
            let score = this.getSimilarity(t, directions[d]);
            if (score < 0.5)
                continue;
            if (score > maxScore) {
                maxScore = score;
                ctr = directions[d];
            }
        }
        if (maxScore==-1)
            return false;
        return ctr;
    }
    /**
     * Finds the direction of movement for the snake using audio cues
     * @param {Object} e Event object
     * @param {Direction} oldDirection Previous direction of snake
     * @returns False if the direction was not possible else the new direction
     */
    static getDirection(e, oldDirection) {
        try {
            let transcript = e.results[0][0].transcript;
            transcript = transcript.split(' ');
            let direction = transcript.at(-1);
            direction = this.getSimilarDirection(direction);
            if (direction === false)
                return oldDirection;
            if (direction == Direction.UP.name) {
                if (oldDirection != Direction.DOWN)
                    return Direction.UP;
            }
            else if (direction == Direction.DOWN.name) {
                if (oldDirection != Direction.UP)
                    return Direction.DOWN;
            }
            else if (direction == Direction.LEFT.name) {
                if (oldDirection != Direction.RIGHT)
                    return Direction.LEFT;
            }
            else if (direction == Direction.RIGHT.name) {
                if (oldDirection != Direction.LEFT)
                    return Direction.RIGHT;
            }
            return false;
        }
        catch (e) { }
    }
    /**
     * Stops the recorder
     */
    static stop() {
        this.flag = true;
        this.recognition.stop();
    }
}