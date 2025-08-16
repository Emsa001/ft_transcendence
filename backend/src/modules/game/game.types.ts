
/* 
    An Interface are the properties of an object ->
    Any object of type GameState must have 
    these properties, with these exact types 
*/
export interface GameState {
    ballX: number;  // X position of the ball
    ballY: number;  // Y position of the ball
    ballSpeedX: number; // horizontal velocity
    ballSpeedY: number; // vertical velocity
    paddle1Y: number;   // Y position of player 1
    paddle2Y: number;   // Y position of player 2
    score1: number; // score of player 1
    score2: number; // score of player 2
}


/* 
    Describe what kind of data the server
    expect from a client
*/
export type PaddleMovement = {
    paddle?: 1 | 2;
    y?: number;
    action?: 'pause' | 'resume';
};

